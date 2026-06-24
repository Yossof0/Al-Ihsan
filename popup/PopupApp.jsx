import { useTheme } from '../src/context/ThemeContext';
import PrayerQuickView from '../src/components/prayer/PrayerQuickView';

export default function PopupApp() {
  const { resolved } = useTheme();

  return (
    <div className="p-5 animate-fade-in">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-extrabold text-sakeenah-700 dark:text-layl-200">
          Al-Ihsan
        </h1>
        <span className="text-xs px-2 py-1 rounded-full bg-sakeenah-100 dark:bg-layl-800 text-sakeenah-700 dark:text-layl-200">
          {resolved === 'light' ? '🌤️ Light' : '🌙 Dark'}
        </span>
      </header>

      <PrayerQuickView />

      <p className="text-xs text-center text-sakeenah-400 dark:text-layl-500 mt-4">
        Todo quick view lands here next milestone.
      </p>
    </div>
  );
}
