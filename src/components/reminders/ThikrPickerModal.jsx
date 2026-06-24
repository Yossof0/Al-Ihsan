import { useEffect, useState } from 'react';
import { getAll } from '../../db';
import AddThikrModal from '../athkar/AddThikrModal';

export default function ThikrPickerModal({ open, onClose, selectedIds, onConfirm }) {
  const [pool, setPool] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCat, setFilterCat] = useState('all');
  const [filterMood, setFilterMood] = useState('all');
  const [picked, setPicked] = useState(selectedIds || []);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setPicked(selectedIds || []);
    Promise.all([getAll('athkar'), getAll('sibha'), getAll('athkarCategories')]).then(
      ([athkar, sibha, cats]) => {
        setPool([...athkar, ...sibha]);
        setCategories(cats);
      }
    );
  }, [open, selectedIds]);

  if (!open) return null;

  const moods = ['happy', 'sad', 'angry', 'anxious', 'grateful', 'calm'];

  const filtered = pool.filter((item) => {
    if (filterCat !== 'all' && item.categoryId !== filterCat) return false;
    if (filterMood !== 'all' && !(item.moodTags || []).includes(filterMood)) return false;
    return true;
  });

  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const handleNewThikr = async (item) => {
    const { putItem } = await import('../../db');
    await putItem('athkar', item);
    setPool((p) => [...p, item]);
    setPicked((p) => [...p, item.id]);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl bg-white dark:bg-layl-900 p-6 shadow-2xl max-h-[80vh] flex flex-col"
      >
        <h3 className="text-lg font-extrabold text-sakeenah-800 dark:text-layl-100 mb-3">
          Pick thikr for this reminder
        </h3>

        <div className="flex gap-2 mb-3">
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="flex-1 px-2 py-1.5 rounded-lg text-xs bg-sakeenah-50 dark:bg-layl-800 border border-sakeenah-200 dark:border-layl-700"
          >
            <option value="all">All categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select
            value={filterMood}
            onChange={(e) => setFilterMood(e.target.value)}
            className="flex-1 px-2 py-1.5 rounded-lg text-xs bg-sakeenah-50 dark:bg-layl-800 border border-sakeenah-200 dark:border-layl-700"
          >
            <option value="all">All moods</option>
            {moods.map((m) => <option key={m} value={m} className="capitalize">{m}</option>)}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 mb-3">
          {filtered.length === 0 && (
            <p className="text-sm text-sakeenah-400 dark:text-layl-500 text-center py-8">
              Nothing matches these filters — add a new one below.
            </p>
          )}
          {filtered.map((item) => (
            <label
              key={item.id}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors
                ${picked.includes(item.id) ? 'bg-sakeenah-100 dark:bg-layl-800' : 'bg-sakeenah-50/50 dark:bg-layl-900/40'}`}
            >
              <input type="checkbox" checked={picked.includes(item.id)} onChange={() => toggle(item.id)} className="accent-sakeenah-500" />
              <div className="min-w-0">
                <p className="font-arabic text-base text-sakeenah-800 dark:text-layl-100 truncate">{item.text}</p>
                {item.transliteration && <p className="text-xs text-sakeenah-400 dark:text-layl-500">{item.transliteration}</p>}
              </div>
            </label>
          ))}
        </div>

        <button
          onClick={() => setAddOpen(true)}
          className="text-sm font-semibold text-sakeenah-600 dark:text-layl-300 mb-4 self-start"
        >
          + Add a new thikr
        </button>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-semibold text-sakeenah-500 dark:text-layl-300">
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(picked); onClose(); }}
            className="px-5 py-2 rounded-xl text-sm font-bold bg-sakeenah-500 dark:bg-layl-600 text-white hover:scale-105 transition-transform"
          >
            Confirm ({picked.length})
          </button>
        </div>
      </div>

      <AddThikrModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={handleNewThikr}
        categoryId={categories[0]?.id}
      />
    </div>
  );
}
