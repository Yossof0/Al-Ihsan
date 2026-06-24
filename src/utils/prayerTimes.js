// src/utils/prayerTimes.js
// Wraps the Aladhan API (https://aladhan.com/prayer-times-api) and applies
// user-configured offsets on top of the raw API response.

const CALC_METHOD_IDS = {
  MWL: 3,
  ISNA: 2,
  Egypt: 5,
  Makkah: 4,
  Karachi: 1,
};

const PRAYER_KEYS = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

/**
 * Fetch today's prayer times.
 * @param {{lat:number,lng:number}|null} coords - geolocation, or null if using a city
 * @param {string} city - fallback city name when coords is null
 * @param {string} calcMethod - one of CALC_METHOD_IDS keys
 */
export async function fetchPrayerTimes({ coords, city, calcMethod = 'MWL' }) {
  const methodId = CALC_METHOD_IDS[calcMethod] ?? 3;
  const date = Math.floor(Date.now() / 1000);

  let url;
  if (coords) {
    url = `https://api.aladhan.com/v1/timings/${date}?latitude=${coords.lat}&longitude=${coords.lng}&method=${methodId}`;
  } else if (city) {
    url = `https://api.aladhan.com/v1/timingsByCity/${date}?city=${encodeURIComponent(city)}&country=&method=${methodId}`;
  } else {
    throw new Error('No location available — set one in Settings.');
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Prayer times request failed (${res.status})`);
  const json = await res.json();

  const timings = json?.data?.timings;
  if (!timings) throw new Error('Unexpected response from prayer times service.');

  const result = {};
  for (const key of PRAYER_KEYS) {
    result[key.toLowerCase()] = timings[key]?.slice(0, 5) ?? null; // "HH:MM"
  }
  return result;
}

/** Apply per-prayer minute offsets (positive or negative) to a "HH:MM" string. */
export function applyOffset(time, minutes = 0) {
  if (!time || !minutes) return time;
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const wrapped = ((total % 1440) + 1440) % 1440;
  const hh = String(Math.floor(wrapped / 60)).padStart(2, '0');
  const mm = String(wrapped % 60).padStart(2, '0');
  return `${hh}:${mm}`;
}

/** Get current geolocation as {lat, lng}, rejecting if denied/unavailable. */
export function getCoords() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('Geolocation unsupported'));
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err)
    );
  });
}

/** Given today's (offset-applied) prayer times, find the next upcoming prayer + countdown. */
export function getNextPrayer(times) {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const COUNTDOWN_KEYS = PRAYER_KEYS.filter((k) => k !== 'Sunrise').map((k) => k.toLowerCase());
  const entries = COUNTDOWN_KEYS.filter((k) => times[k])
    .map((k) => {
      const [h, m] = times[k].split(':').map(Number);
      return { key: k, minutes: h * 60 + m };
    });

  let next = entries.find((e) => e.minutes > nowMinutes);
  if (!next) next = entries[0]; // wrap to tomorrow's Fajr

  const diff = next.minutes > nowMinutes ? next.minutes - nowMinutes : 1440 - nowMinutes + next.minutes;
  return {
    name: next.key,
    time: times[next.key],
    minutesUntil: diff,
  };
}

export const ADHAN_SOUND_FILES = {
  mecca: '/audio/adhan-mecca.mp3',
  medina: '/audio/adhan-medina.mp3',
  alaqsa: '/audio/adhan-alaqsa.mp3',
  turkish: '/audio/adhan-turkish.mp3',
  none: null,
};

export { PRAYER_KEYS, CALC_METHOD_IDS };
