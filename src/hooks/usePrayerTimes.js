// src/hooks/usePrayerTimes.js
import { useEffect, useState, useCallback } from 'react';
import { getSetting, setSetting } from '../db';
import { fetchPrayerTimes, applyOffset, getCoords, getNextPrayer } from '../utils/prayerTimes';

const CACHE_KEY = 'prayerTimesCache'; // { date: 'YYYY-MM-DD', raw: {...} }

export function usePrayerTimes() {
  const [rawTimes, setRawTimes] = useState(null);   // straight from API
  const [times, setTimes] = useState(null);          // with offsets applied
  const [next, setNext] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const cache = await getSetting(CACHE_KEY, null);

      let raw;
      if (cache && cache.date === today) {
        raw = cache.raw;
      } else {
        const locationMode = await getSetting('locationMode', 'auto');
        const city = await getSetting('city', '');
        const calcMethod = await getSetting('calcMethod', 'MWL');

        let coords = null;
        if (locationMode === 'auto') {
          try {
            coords = await getCoords();
          } catch {
            coords = null; // fall through to city if geolocation fails
          }
        }

        raw = await fetchPrayerTimes({ coords, city, calcMethod });
        await setSetting(CACHE_KEY, { date: today, raw });
      }

      setRawTimes(raw);

      const offsets = await getSetting('prayerOffsets', {});
      const withOffsets = Object.fromEntries(
        Object.entries(raw).map(([k, v]) => [k, applyOffset(v, offsets[k] || 0)])
      );
      setTimes(withOffsets);
      setNext(getNextPrayer(withOffsets));
    } catch (e) {
      setError(e.message || 'Could not load prayer times');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Tick the countdown every 30s without re-fetching.
  useEffect(() => {
    if (!times) return;
    const interval = setInterval(() => setNext(getNextPrayer(times)), 30 * 1000);
    return () => clearInterval(interval);
  }, [times]);

  return { times, rawTimes, next, loading, error, reload: load };
}
