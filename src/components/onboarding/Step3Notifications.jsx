const ADHAN_OPTIONS = [
  { id: 'mecca', label: 'Mecca — Sheikh Ali Mulla' },
  { id: 'medina', label: 'Medina — Sheikh Mahmoud' },
  { id: 'alaqsa', label: 'Al-Aqsa' },
  { id: 'turkish', label: 'Turkish style' },
  { id: 'none', label: 'Silent (visual only)' },
];

export default function Step3Notifications({ data, update }) {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-extrabold text-sakeenah-800 dark:text-layl-100 mb-2">
        Notifications &amp; Adhan
      </h2>
      <p className="text-sm text-sakeenah-600 dark:text-layl-300 mb-5">
        You'll be able to toggle each prayer individually later in Settings — this just sets your default.
      </p>

      <label className="flex items-center justify-between p-4 rounded-2xl bg-sakeenah-50 dark:bg-layl-800/60 mb-5 cursor-pointer">
        <span className="text-sm font-semibold text-sakeenah-800 dark:text-layl-100">
          Enable prayer time notifications
        </span>
        <input
          type="checkbox"
          checked={data.notificationsEnabled}
          onChange={(e) => update({ notificationsEnabled: e.target.checked })}
          className="w-5 h-5 accent-sakeenah-500"
        />
      </label>

      <div>
        <p className="text-xs font-semibold text-sakeenah-500 dark:text-layl-400 mb-2">Adhan sound</p>
        <div className="flex flex-col gap-2">
          {ADHAN_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer text-sm transition-colors
                ${data.adhanSound === opt.id
                  ? 'bg-sakeenah-500 dark:bg-layl-600 text-white font-semibold'
                  : 'bg-sakeenah-50 dark:bg-layl-800/60 text-sakeenah-700 dark:text-layl-200'}`}
            >
              <input
                type="radio"
                name="adhan"
                checked={data.adhanSound === opt.id}
                onChange={() => update({ adhanSound: opt.id })}
                className="accent-white"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
