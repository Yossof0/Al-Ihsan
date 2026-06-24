const CALC_METHODS = [
  { id: 'MWL', label: 'Muslim World League' },
  { id: 'ISNA', label: 'ISNA (North America)' },
  { id: 'Egypt', label: 'Egyptian General Authority' },
  { id: 'Makkah', label: 'Umm al-Qura, Makkah' },
  { id: 'Karachi', label: 'University of Islamic Sciences, Karachi' },
];

const PRAYERS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export default function Step2Location({ data, update }) {
  const setOffset = (prayer, value) =>
    update({ offsets: { ...data.offsets, [prayer]: Number(value) } });

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-extrabold text-sakeenah-800 dark:text-layl-100 mb-2">
        Location &amp; calculation
      </h2>
      <p className="text-sm text-sakeenah-600 dark:text-layl-300 mb-5">
        Choose how prayer times are calculated, and fine-tune each one if needed.
      </p>

      {data.locationMode === 'manual' && (
        <div className="mb-4">
          <label className="text-xs font-semibold text-sakeenah-500 dark:text-layl-400">City (manual location)</label>
          <input
            type="text"
            value={data.city}
            onChange={(e) => update({ city: e.target.value })}
            placeholder="e.g. Cairo, Egypt"
            className="mt-1 w-full px-3 py-2 rounded-xl bg-sakeenah-50 dark:bg-layl-800 border border-sakeenah-200 dark:border-layl-700 text-sm outline-none focus:ring-2 focus:ring-sakeenah-400 dark:focus:ring-layl-500"
          />
        </div>
      )}

      <div className="mb-5">
        <label className="text-xs font-semibold text-sakeenah-500 dark:text-layl-400">Calculation method</label>
        <select
          value={data.calcMethod}
          onChange={(e) => update({ calcMethod: e.target.value })}
          className="mt-1 w-full px-3 py-2 rounded-xl bg-sakeenah-50 dark:bg-layl-800 border border-sakeenah-200 dark:border-layl-700 text-sm outline-none focus:ring-2 focus:ring-sakeenah-400 dark:focus:ring-layl-500"
        >
          {CALC_METHODS.map((m) => (
            <option key={m.id} value={m.id}>{m.label}</option>
          ))}
        </select>
      </div>

      <div>
        <p className="text-xs font-semibold text-sakeenah-500 dark:text-layl-400 mb-2">
          Offsets (minutes) — optional, can leave at 0
        </p>
        <div className="grid grid-cols-5 gap-2">
          {PRAYERS.map((p) => (
            <div key={p} className="flex flex-col items-center">
              <span className="text-[11px] capitalize text-sakeenah-500 dark:text-layl-400 mb-1">{p}</span>
              <input
                type="number"
                value={data.offsets[p]}
                onChange={(e) => setOffset(p, e.target.value)}
                className="w-full text-center px-1 py-1.5 rounded-lg bg-sakeenah-50 dark:bg-layl-800 border border-sakeenah-200 dark:border-layl-700 text-sm outline-none focus:ring-2 focus:ring-sakeenah-400 dark:focus:ring-layl-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
