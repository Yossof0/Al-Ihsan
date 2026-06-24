import { useTheme } from '../src/context/ThemeContext';

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

      <div className="rounded-2xl p-4 bg-sakeenah-100/60 dark:bg-layl-900/60 border border-sakeenah-200 dark:border-layl-800">
        <p className="text-sm text-sakeenah-700 dark:text-layl-200">
          Foundation is live — prayer times &amp; quick todo view land here next.
        </p>
      </div>
    </div>
  );
}
