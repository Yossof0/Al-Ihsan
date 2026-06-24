import { useState } from 'react';
import { THIKR_LIBRARY } from '../../data/thikrLibrary';

const MOODS = ['happy', 'sad', 'angry', 'anxious', 'grateful', 'calm'];

export default function AddThikrModal({ open, onClose, onSave, categoryId, isSibha = false }) {
  const [tab, setTab] = useState('library'); // 'library' | 'custom'
  const [form, setForm] = useState({
    text: '',
    transliteration: '',
    order: 1,
    count: 1,
    reward: '',
    proof: '',
    moodTags: [],
  });

  if (!open) return null;

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const toggleMood = (m) =>
    set({ moodTags: form.moodTags.includes(m) ? form.moodTags.filter((x) => x !== m) : [...form.moodTags, m] });

  const resetAndClose = () => {
    onClose();
    setForm({ text: '', transliteration: '', order: 1, count: 1, reward: '', proof: '', moodTags: [] });
    setTab('library');
  };

  const handleSave = () => {
    if (!form.text.trim()) return;
    onSave({
      id: `custom-${Date.now()}`,
      categoryId,
      ...form,
      order: Number(form.order),
      count: Number(form.count) || 1,
    });
    resetAndClose();
  };

  const addFromLibrary = (entry) => {
    onSave({
      id: `lib-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      categoryId,
      order: 99,
      ...entry,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in" onClick={resetAndClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-white dark:bg-layl-900 p-6 shadow-2xl max-h-[85vh] flex flex-col"
      >
        <h3 className="text-lg font-extrabold text-sakeenah-800 dark:text-layl-100 mb-4">
          Add {isSibha ? 'Dua' : 'Thikr'}
        </h3>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab('library')}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors
              ${tab === 'library' ? 'bg-sakeenah-500 dark:bg-layl-600 text-white' : 'bg-sakeenah-50 dark:bg-layl-800 text-sakeenah-600 dark:text-layl-300'}`}
          >
            From library
          </button>
          <button
            onClick={() => setTab('custom')}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors
              ${tab === 'custom' ? 'bg-sakeenah-500 dark:bg-layl-600 text-white' : 'bg-sakeenah-50 dark:bg-layl-800 text-sakeenah-600 dark:text-layl-300'}`}
          >
            Custom
          </button>
        </div>

        {tab === 'library' ? (
          <div className="overflow-y-auto space-y-2 -mx-1 px-1">
            {THIKR_LIBRARY.map((entry, i) => (
              <button
                key={i}
                onClick={() => addFromLibrary(entry)}
                className="w-full text-left p-3 rounded-xl bg-sakeenah-50 dark:bg-layl-800/60 hover:bg-sakeenah-100 dark:hover:bg-layl-800 transition-colors flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="font-arabic text-lg text-sakeenah-800 dark:text-layl-100 truncate">{entry.text}</p>
                  <p className="text-xs text-sakeenah-400 dark:text-layl-500">{entry.transliteration} · {entry.count}x</p>
                </div>
                <span className="text-sakeenah-400 dark:text-layl-500 text-lg shrink-0">+</span>
              </button>
            ))}
            <p className="text-xs text-center text-sakeenah-400 dark:text-layl-500 pt-2">
              Not finding it? Switch to "Custom" above to write your own.
            </p>
          </div>
        ) : (
          <div className="overflow-y-auto -mx-1 px-1">
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
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-sakeenah-100 dark:border-layl-800">
          <button onClick={resetAndClose} className="px-4 py-2 rounded-xl text-sm font-semibold text-sakeenah-500 dark:text-layl-300">
            {tab === 'library' ? 'Close' : 'Cancel'}
          </button>
          {tab === 'custom' && (
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-sm font-bold bg-sakeenah-500 dark:bg-layl-600 text-white hover:scale-105 transition-transform"
            >
              Save
            </button>
          )}
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
