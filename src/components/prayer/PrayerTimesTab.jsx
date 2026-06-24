import { useEffect, useState } from 'react';
import { usePrayerTimes } from '../../hooks/usePrayerTimes';
import { getSetting, setSetting } from '../../db';

const LABELS = { fajr: 'Fajr', dhuhr: 'Dhuhr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Isha' };
const ADHAN_OPTIONS = [
  { id: 'mecca', label: 'Mecca' },
  { id: 'medina', label: 'Medina' },
  { id: 'alaqsa', label: 'Al-Aqsa' },
  { id: 'turkish', label: 'Turkish' },
  { id: 'none', label: 'Silent' },
];

export default function PrayerTimesTab() {
  const { times, next, loading, error, reload } = usePrayerTimes();
  const [offsets, setOffsets] = useState({});
  const [notifPerPrayer, setNotifPerPrayer] = useState({});
  const [adhanSound, setAdhanSound] = useState('mecca');

  useEffect(() => {
    getSetting('prayerOffsets', { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 }).then(setOffsets);
    getSetting('prayerNotifPerPrayer', { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true }).then(setNotifPerPrayer);
    getSetting('adhanSound', 'mecca').then(setAdhanSound);
  }, []);

  const updateOffset = async (key, value) => {
    const next = { ...offsets, [key]: Number(value) };
    setOffsets(next);
    await setSetting('prayerOffsets', next);
    await setSetting('prayerTimesCache', null); // invalidate cache so offset reflects immediately
    reload();
  };

  const toggleNotif = async (key) => {
    const next = { ...notifPerPrayer, [key]: !notifPerPrayer[key] };
    setNotifPerPrayer(next);
    await setSetting('prayerNotifPerPrayer', next);
  };

  const updateAdhan = async (id) => {
    setAdhanSound(id);
    await setSetting('adhanSound', id);
  };

  if (loading) return <p className="text-sakeenah-500 dark:text-layl-400 animate-pulse">Loading today's times…</p>;
  if (error) {
    return (
      <div>
        <p className="text-amber-600 mb-3">{error}</p>
        <button onClick={reload} className="px-4 py-2 rounded-xl bg-sakeenah-500 dark:bg-layl-600 text-white text-sm font-semibold">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Next prayer hero */}
      <div className="rounded-3xl p-6 bg-sakeenah-500 dark:bg-layl-700 text-white relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10" />
        <p className="text-sm opacity-80 relative">Next prayer</p>
        <p className="text-4xl font-extrabold relative">{LABELS[next.name]} — {next.time}</p>
        <p className="text-sm opacity-90 relative mt-1">
          in {Math.floor(next.minutesUntil / 60)}h {next.minutesUntil % 60}m
        </p>
      </div>

      {/* Per-prayer config table */}
      <div className="rounded-2xl border border-sakeenah-200 dark:border-layl-800 overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 px-4 py-2 text-xs font-bold text-sakeenah-400 dark:text-layl-500 bg-sakeenah-50 dark:bg-layl-900">
          <span>Prayer</span>
          <span>Offset (min)</span>
          <span>Notify</span>
        </div>
        {Object.entries(LABELS).map(([key, label], i) => (
          <div
            key={key}
            className={`grid grid-cols-[1fr_auto_auto] gap-3 items-center px-4 py-3 text-sm
              ${i % 2 === 0 ? 'bg-white dark:bg-layl-900/40' : 'bg-sakeenah-50/50 dark:bg-layl-900/70'}`}
          >
            <div>
              <p className="font-semibold text-sakeenah-800 dark:text-layl-100">{label}</p>
              <p className="text-xs text-sakeenah-400 dark:text-layl-500">{times[key]}</p>
            </div>
            <input
              type="number"
              value={offsets[key] ?? 0}
              onChange={(e) => updateOffset(key, e.target.value)}
              className="w-16 text-center px-2 py-1 rounded-lg bg-sakeenah-50 dark:bg-layl-800 border border-sakeenah-200 dark:border-layl-700 text-sm outline-none focus:ring-2 focus:ring-sakeenah-400 dark:focus:ring-layl-500"
            />
            <button
              onClick={() => toggleNotif(key)}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors ${notifPerPrayer[key] ? 'bg-sakeenah-500 dark:bg-layl-600' : 'bg-sakeenah-200 dark:bg-layl-700'}`}
            >
              <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${notifPerPrayer[key] ? 'translate-x-5' : ''}`} />
            </button>
          </div>
        ))}
      </div>

      {/* Adhan sound */}
      <div>
        <p className="text-xs font-bold text-sakeenah-400 dark:text-layl-500 mb-2">Adhan sound</p>
        <div className="flex gap-2 flex-wrap">
          {ADHAN_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => updateAdhan(opt.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors
                ${adhanSound === opt.id
                  ? 'bg-sakeenah-500 dark:bg-layl-600 text-white'
                  : 'bg-sakeenah-50 dark:bg-layl-800/60 text-sakeenah-700 dark:text-layl-200'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
