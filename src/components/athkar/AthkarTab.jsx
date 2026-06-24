import { useEffect, useState } from 'react';
import { getAll, putItem, deleteItem } from '../../db';
import { seedAthkarIfNeeded } from '../../utils/seedAthkar';
import ThikrCard from './ThikrCard';
import AddThikrModal from './AddThikrModal';

export default function AthkarTab() {
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat] = useState(null);
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [addingCat, setAddingCat] = useState(false);

  const refresh = async () => {
    await seedAthkarIfNeeded();
    const [cats, allItems] = await Promise.all([getAll('athkarCategories'), getAll('athkar')]);
    const nonSibha = cats.filter((c) => !c.isSibha);
    setCategories(nonSibha);
    setItems(allItems);
    setActiveCat((prev) => prev ?? nonSibha[0]?.id ?? null);
  };

  useEffect(() => { refresh(); }, []);

  const visibleItems = items
    .filter((i) => i.categoryId === activeCat)
    .sort((a, b) => a.order - b.order);

  const addCategory = async () => {
    if (!newCatName.trim()) return;
    const cat = { id: `cat-${Date.now()}`, name: newCatName.trim(), icon: '📌' };
    await putItem('athkarCategories', cat);
    setNewCatName('');
    setAddingCat(false);
    refresh();
  };

  const saveThikr = async (item) => {
    await putItem('athkar', item);
    refresh();
  };

  const updateThikr = async (item, patch) => {
    const updated = { ...item, ...patch };
    await putItem('athkar', updated);
    setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
  };

  const removeCategory = async (id) => {
    await deleteItem('athkarCategories', id);
    const itemsInCat = items.filter((i) => i.categoryId === id);
    await Promise.all(itemsInCat.map((i) => deleteItem('athkar', i.id)));
    if (activeCat === id) setActiveCat(null);
    refresh();
  };

  return (
    <div className="flex gap-6 animate-fade-in">
      {/* Category rail */}
      <div className="w-48 shrink-0 flex flex-col gap-1.5">
        {categories.map((cat) => (
          <div key={cat.id} className="group relative">
            <button
              onClick={() => setActiveCat(cat.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors
                ${activeCat === cat.id
                  ? 'bg-sakeenah-500 dark:bg-layl-600 text-white'
                  : 'bg-sakeenah-50 dark:bg-layl-800/60 text-sakeenah-700 dark:text-layl-200'}`}
            >
              <span>{cat.icon}</span> {cat.name}
            </button>
            {!cat.id.startsWith('cat-after-prayer') && (
              <button
                onClick={() => removeCategory(cat.id)}
                className="opacity-0 group-hover:opacity-100 absolute right-1.5 top-1.5 text-xs text-white/70 hover:text-white transition-opacity"
                title="Remove category"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        {addingCat ? (
          <div className="flex gap-1 mt-1">
            <input
              autoFocus
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCategory()}
              placeholder="Category name"
              className="flex-1 px-2 py-1.5 rounded-lg text-sm bg-sakeenah-50 dark:bg-layl-800 border border-sakeenah-200 dark:border-layl-700 outline-none"
            />
            <button onClick={addCategory} className="px-2 rounded-lg bg-sakeenah-500 dark:bg-layl-600 text-white text-sm">✓</button>
          </div>
        ) : (
          <button
            onClick={() => setAddingCat(true)}
            className="text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-sakeenah-500 dark:text-layl-400 border border-dashed border-sakeenah-300 dark:border-layl-700 mt-1"
          >
            + Category
          </button>
        )}
      </div>

      {/* Thikr list */}
      <div className="flex-1 space-y-3">
        <div className="flex justify-end">
          <button
            onClick={() => setModalOpen(true)}
            disabled={!activeCat}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-sakeenah-500 dark:bg-layl-600 text-white hover:scale-105 transition-transform disabled:opacity-40"
          >
            + Thikr
          </button>
        </div>

        {visibleItems.length === 0 && (
          <p className="text-sm text-sakeenah-400 dark:text-layl-500 text-center py-12">
            No athkar in this category yet — add one above.
          </p>
        )}

        {visibleItems.map((item) => (
          <ThikrCard key={item.id} item={item} onUpdate={updateThikr} />
        ))}
      </div>

      <AddThikrModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={saveThikr}
        categoryId={activeCat}
      />
    </div>
  );
}
