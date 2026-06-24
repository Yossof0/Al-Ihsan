export default function Step5Review({ data }) {
  const rows = [
    ['Location', data.locationMode === 'auto' ? 'Automatic' : data.city || 'Manual (not set)'],
    ['Calculation method', data.calcMethod],
    ['Notifications', data.notificationsEnabled ? 'Enabled' : 'Off'],
    ['Adhan sound', data.adhanSound],
    ['Athkar', data.athkarDensity === 'minimal' ? 'Minimal set' : 'Full set'],
    ['Theme', data.themePref],
  ];

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-extrabold text-sakeenah-800 dark:text-layl-100 mb-2">
        You're all set 🌟
      </h2>
      <p className="text-sm text-sakeenah-600 dark:text-layl-300 mb-5">
        Here's a quick summary — everything is editable later in Settings.
      </p>

      <div className="rounded-2xl overflow-hidden border border-sakeenah-200 dark:border-layl-800">
        {rows.map(([label, value], i) => (
          <div
            key={label}
            className={`flex justify-between px-4 py-3 text-sm ${i % 2 === 0 ? 'bg-sakeenah-50 dark:bg-layl-800/40' : ''}`}
          >
            <span className="text-sakeenah-500 dark:text-layl-400">{label}</span>
            <span className="font-semibold text-sakeenah-800 dark:text-layl-100 capitalize">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
