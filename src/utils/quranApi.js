// src/utils/quranApi.js
// Wraps api.alquran.cloud (text + translations) and the islamic.network CDN
// (reciter audio files) — both run by the same Quran open-data project.

const BASE = 'https://api.alquran.cloud/v1';
const AUDIO_CDN = 'https://cdn.islamic.network/quran/audio-surah';

/** Fetch a single Juz (1-30) in the Uthmani Arabic script. */
export async function fetchJuz(juzNumber = 1) {
  const res = await fetch(`${BASE}/juz/${juzNumber}/quran-uthmani`);
  if (!res.ok) throw new Error(`Could not load Juz ${juzNumber} (${res.status})`);
  const json = await res.json();
  return json.data.ayahs.map((a) => ({
    number: a.number,
    numberInSurah: a.numberInSurah,
    surahNumber: a.surah.number,
    surahName: a.surah.englishName,
    text: a.text,
    juz: a.juz,
  }));
}

/** List of selectable English translation editions. */
export async function fetchTranslationEditions() {
  const res = await fetch(`${BASE}/edition?format=text&type=translation&language=en`);
  if (!res.ok) throw new Error('Could not load translation list');
  const json = await res.json();
  return json.data.map((e) => ({ id: e.identifier, name: e.englishName, author: e.name }));
}

/** Download a full translation's text by edition identifier (e.g. "en.sahih"). */
export async function fetchTranslationText(editionId) {
  const res = await fetch(`${BASE}/quran/${editionId}`);
  if (!res.ok) throw new Error(`Could not download translation "${editionId}"`);
  const json = await res.json();
  const surahs = json.data.surahs;
  const ayahs = surahs.flatMap((s) =>
    s.ayahs.map((a) => ({ number: a.number, numberInSurah: a.numberInSurah, surahNumber: s.number, text: a.text }))
  );
  return ayahs;
}

/** Popular reciters with their CDN folder identifiers (bitrate 128kbps). */
export const POPULAR_RECITERS = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy' },
  { id: 'ar.abdulbasitmurattal', name: 'Abdul Basit (Murattal)' },
  { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary' },
  { id: 'ar.minshawi', name: 'Mohamed Siddiq El-Minshawi' },
  { id: 'ar.sudais', name: 'Abdul Rahman Al-Sudais' },
  { id: 'ar.shaatree', name: 'Abu Bakr Al-Shaatree' },
];

/** Build the direct mp3 URL for a given reciter + surah number (1-114). */
export function audioUrlFor(reciterId, surahNumber) {
  return `${AUDIO_CDN}/128/${reciterId}/${surahNumber}.mp3`;
}

/** Trigger a save-to-Downloads for a reciter's recitation of one surah. */
export function downloadSurahAudio(reciterId, surahNumber, reciterName) {
  const url = audioUrlFor(reciterId, surahNumber);
  const filename = `Al-Ihsan/${reciterName.replace(/\s+/g, '-')}/surah-${String(surahNumber).padStart(3, '0')}.mp3`;
  if (chrome?.downloads) {
    chrome.downloads.download({ url, filename, saveAs: false });
  } else {
    // Fallback for previewing outside the extension context.
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  }
}

export const SURAH_NAMES = [
  'Al-Fatihah', 'Al-Baqarah', "Aali Imran", 'An-Nisa', "Al-Ma'idah", 'Al-Anam', 'Al-Araf', 'Al-Anfal', 'At-Tawbah', 'Yunus',
  // … truncated for brevity; full 114-name list belongs in the polish pass once the reader UX is locked.
];
