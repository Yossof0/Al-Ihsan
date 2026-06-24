const TABS = [
  { id: 'prayer', label: 'Prayer Times', icon: '🕐' },
  { id: 'quran', label: 'Quran', icon: '📖' },
  { id: 'athkar', label: 'Athkar', icon: '📿' },
  { id: 'sibha', label: 'Sibha', icon: '🔵' },
  { id: 'mood', label: 'Mood Athkar', icon: '🌙' },
  { id: 'reminders', label: 'Thikr Reminder', icon: '🔔' },
  { id: 'todo', label: 'Todo', icon: '🗂️' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar({ active, onSelect }) {
  return (
    <nav className="w-60 shrink-0 h-full bg-sakeenah-100/70 dark:bg-layl-900/70 border-r border-sakeenah-200 dark:border-layl-800 p-3 flex flex-col gap-1">
      <div className="px-3 py-4 mb-2">
        <h1 className="text-xl font-extrabold text-sakeenah-700 dark:text-layl-200">Al-Ihsan</h1>
        <p className="text-xs text-sakeenah-500 dark:text-layl-400">الإحسان</p>
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

export { TABS };
