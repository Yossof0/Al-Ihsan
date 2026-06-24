import { usePrayerTimes } from '../../hooks/usePrayerTimes';

const LABELS = { fajr: 'Fajr', sunrise: 'Shuruq', dhuhr: 'Dhuhr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Isha' };

export default function PrayerQuickView() {
  const { times, next, loading, error, reload } = usePrayerTimes();

  if (loading) {
    return <div className="text-sm text-sakeenah-500 dark:text-layl-400 animate-pulse">Loading prayer times…</div>;
  }

  if (error) {
    return (
      <div className="text-sm">
        <p className="text-amber-600 mb-2">{error}</p>
        <button onClick={reload} className="text-xs font-semibold text-sakeenah-600 dark:text-layl-300 underline">
          Try again
        </button>
      </div>
    );
  }

  const hours = Math.floor(next.minutesUntil / 60);
  const mins = next.minutesUntil % 60;

  return (
    <div className="animate-fade-in">
      <div className="rounded-2xl p-4 bg-sakeenah-500 dark:bg-layl-700 text-white mb-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <p className="text-xs opacity-80 relative">Next: {LABELS[next.name]}</p>
        <p className="text-2xl font-extrabold relative">{next.time}</p>
        <p className="text-xs opacity-90 relative">
          in {hours > 0 ? `${hours}h ` : ''}{mins}m
        </p>
      </div>

      <div className="grid grid-cols-6 gap-1">
        {Object.entries(LABELS).map(([key, label]) => (
          <div
            key={key}
            className={`flex flex-col items-center py-2 rounded-xl text-[11px]
              ${key === next.name
                ? 'bg-sakeenah-100 dark:bg-layl-800 text-sakeenah-700 dark:text-layl-200 font-bold'
                : 'text-sakeenah-500 dark:text-layl-400'}`}
          >
            <span>{label}</span>
            <span className="font-semibold mt-0.5">{times[key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
