import { useState } from 'react';

const MOODS = ['happy', 'sad', 'angry', 'anxious', 'grateful', 'calm'];

export default function AddThikrModal({ open, onClose, onSave, categoryId, isSibha = false }) {
  const [form, setForm] = useState({
    text: '',
    transliteration: '',
    order: 1,
    count: 1,
    reward: '',
    proof: '',
    moodTags: [],
    displayMode: 'rect',
  });

  if (!open) return null;

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const toggleMood = (m) =>
    set({ moodTags: form.moodTags.includes(m) ? form.moodTags.filter((x) => x !== m) : [...form.moodTags, m] });

  const handleSave = () => {
    if (!form.text.trim()) return;
    onSave({
      id: `custom-${Date.now()}`,
      categoryId,
      ...form,
      order: Number(form.order),
      count: Number(form.count) || 1,
    });
    onClose();
    setForm({ text: '', transliteration: '', order: 1, count: 1, reward: '', proof: '', moodTags: [], displayMode: 'rect' });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-white dark:bg-layl-900 p-6 shadow-2xl max-h-[85vh] overflow-y-auto"
      >
        <h3 className="text-lg font-extrabold text-sakeenah-800 dark:text-layl-100 mb-4">
          Add {isSibha ? 'Dua' : 'Thikr'}
        </h3>

        <Field label="Text (Arabic)">
          <textarea
            value={form.text}
            onChange={(e) => set({ text: e.target.value })}
            dir="rtl"
            rows={2}
            className="font-arabic text-lg w-full px-3 py-2 rounded-xl bg-sakeenah-50 dark:bg-layl-800 border border-sakeenah-200 dark:border-layl-700 outline-none focus:ring-2 focus:ring-sakeenah-400"
          />
        </Field>

        <Field label="Transliteration (optional)">
          <input
            value={form.transliteration}
            onChange={(e) => set({ transliteration: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-sakeenah-50 dark:bg-layl-800 border border-sakeenah-200 dark:border-layl-700 text-sm outline-none focus:ring-2 focus:ring-sakeenah-400"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Display order">
            <input
              type="number"
              value={form.order}
              onChange={(e) => set({ order: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-sakeenah-50 dark:bg-layl-800 border border-sakeenah-200 dark:border-layl-700 text-sm outline-none focus:ring-2 focus:ring-sakeenah-400"
            />
          </Field>
          <Field label="Times to say">
            <input
              type="number"
              value={form.count}
              onChange={(e) => set({ count: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-sakeenah-50 dark:bg-layl-800 border border-sakeenah-200 dark:border-layl-700 text-sm outline-none focus:ring-2 focus:ring-sakeenah-400"
            />
          </Field>
        </div>

        <Field label="Reward (shown on the card)">
          <textarea
            value={form.reward}
            onChange={(e) => set({ reward: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 rounded-xl bg-sakeenah-50 dark:bg-layl-800 border border-sakeenah-200 dark:border-layl-700 text-sm outline-none focus:ring-2 focus:ring-sakeenah-400"
          />
        </Field>

        <Field label="Proof / source (Hadith reference)">
          <textarea
            value={form.proof}
            onChange={(e) => set({ proof: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 rounded-xl bg-sakeenah-50 dark:bg-layl-800 border border-sakeenah-200 dark:border-layl-700 text-sm outline-none focus:ring-2 focus:ring-sakeenah-400"
          />
        </Field>

        <Field label="Mood tags (optional — for the Mood tab)">
          <div className="flex gap-1.5 flex-wrap">
            {MOODS.map((m) => (
              <button
                key={m}
                onClick={() => toggleMood(m)}
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-colors
                  ${form.moodTags.includes(m)
                    ? 'bg-sakeenah-500 dark:bg-layl-600 text-white'
                    : 'bg-sakeenah-50 dark:bg-layl-800 text-sakeenah-600 dark:text-layl-300'}`}
              >
                {m}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Display style">
          <div className="flex gap-2">
            {['rect', 'ring'].map((d) => (
              <button
                key={d}
                onClick={() => set({ displayMode: d })}
                className={`flex-1 px-3 py-2 rounded-xl text-sm font-semibold capitalize transition-colors
                  ${form.displayMode === d
                    ? 'bg-sakeenah-500 dark:bg-layl-600 text-white'
                    : 'bg-sakeenah-50 dark:bg-layl-800 text-sakeenah-600 dark:text-layl-300'}`}
              >
                {d === 'rect' ? 'Rectangle' : 'Progress ring'}
              </button>
            ))}
          </div>
        </Field>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-semibold text-sakeenah-500 dark:text-layl-300">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-sm font-bold bg-sakeenah-500 dark:bg-layl-600 text-white hover:scale-105 transition-transform"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="mb-4">
      <label className="text-xs font-semibold text-sakeenah-500 dark:text-layl-400 mb-1 block">{label}</label>
      {children}
    </div>
  );
}
