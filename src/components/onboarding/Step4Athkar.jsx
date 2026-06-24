export default function Step4Athkar({ data, update }) {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-extrabold text-sakeenah-800 dark:text-layl-100 mb-2">
        Athkar &amp; appearance
      </h2>
      <p className="text-sm text-sakeenah-600 dark:text-layl-300 mb-5">
        How much should we pre-load for you? You can always add more — or less — afterward.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <DensityCard
          title="Minimal"
          desc="Just the essentials — a handful of core athkar per category."
          selected={data.athkarDensity === 'minimal'}
          onClick={() => update({ athkarDensity: 'minimal' })}
        />
        <DensityCard
          title="Full set"
          desc="Everything out of the box — every default category, fully stocked."
          selected={data.athkarDensity === 'full'}
          onClick={() => update({ athkarDensity: 'full' })}
        />
      </div>

      <p className="text-xs font-semibold text-sakeenah-500 dark:text-layl-400 mb-2">Theme</p>
      <div className="flex gap-2">
        {['auto', 'light', 'dark'].map((m) => (
          <button
            key={m}
            onClick={() => update({ themePref: m })}
            className={`flex-1 capitalize px-3 py-2 rounded-xl text-sm font-semibold transition-colors
              ${data.themePref === m
                ? 'bg-sakeenah-500 dark:bg-layl-600 text-white'
                : 'bg-sakeenah-50 dark:bg-layl-800/60 text-sakeenah-700 dark:text-layl-200'}`}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}

function DensityCard({ title, desc, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-4 rounded-2xl border transition-all duration-200
        ${selected
          ? 'border-sakeenah-500 dark:border-layl-500 bg-sakeenah-50 dark:bg-layl-800/60 scale-[1.02]'
          : 'border-sakeenah-200 dark:border-layl-800 hover:scale-[1.01]'}`}
    >
      <p className="font-bold text-sm text-sakeenah-800 dark:text-layl-100">{title}</p>
      <p className="text-xs text-sakeenah-500 dark:text-layl-400 mt-1">{desc}</p>
    </button>
  );
}
