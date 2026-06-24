import { useLanguage } from '../../context/LanguageContext';

const TAB_DEFS = [
  { id: 'prayer', key: 'tab_prayer', icon: '🕐' },
  { id: 'quran', key: 'tab_quran', icon: '📖' },
  { id: 'athkar', key: 'tab_athkar', icon: '📿' },
  { id: 'sibha', key: 'tab_sibha', icon: '🔵' },
  { id: 'mood', key: 'tab_mood', icon: '🌙' },
  { id: 'reminders', key: 'tab_reminders', icon: '🔔' },
  { id: 'todo', key: 'tab_todo', icon: '🗂️' },
  { id: 'settings', key: 'tab_settings', icon: '⚙️' },
];

export default function Sidebar({ active, onSelect }) {
  const { t, language } = useLanguage();
  const TABS = TAB_DEFS.map((tab) => ({ ...tab, label: t(tab.key) }));

  return (
    <nav className="w-60 shrink-0 h-full bg-sakeenah-100/70 dark:bg-layl-900/70 border-r border-sakeenah-200 dark:border-layl-800 p-3 flex flex-col gap-1">
      <div className="px-3 py-4 mb-2">
        <h1 className="text-xl font-extrabold text-sakeenah-700 dark:text-layl-200">{t('appName')}</h1>
        <p className="text-xs text-sakeenah-500 dark:text-layl-400">{language === 'ar' ? 'Al-Ihsan' : 'الإحسان'}</p>
      </div>

      {TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
              ${isActive
                ? 'bg-sakeenah-500 dark:bg-layl-600 text-white shadow-md scale-[1.02]'
                : 'text-sakeenah-700 dark:text-layl-200 hover:bg-sakeenah-200/70 dark:hover:bg-layl-800/70'}`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}

export { TAB_DEFS as TABS };
