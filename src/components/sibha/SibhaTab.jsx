import { useEffect, useState } from 'react';
import { getAll, putItem } from '../../db';
import { seedAthkarIfNeeded } from '../../utils/seedAthkar';
import ThikrCard from '../athkar/ThikrCard';
import AddThikrModal from '../athkar/AddThikrModal';

const SIBHA_CATEGORY_ID = 'cat-sibha';

export default function SibhaTab() {
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const refresh = async () => {
    await seedAthkarIfNeeded();
    const all = await getAll('sibha');
    setItems(all.sort((a, b) => a.order - b.order));
  };

  useEffect(() => { refresh(); }, []);

  const saveDua = async (item) => {
    await putItem('sibha', item);
    refresh();
  };

  const updateDua = async (item, patch) => {
    const updated = { ...item, ...patch };
    await putItem('sibha', updated);
    setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
  };

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex justify-end">
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-xl text-sm font-bold bg-sakeenah-500 dark:bg-layl-600 text-white hover:scale-105 transition-transform"
        >
          + Dua
        </button>
      </div>

      {items.length === 0 && (
        <p className="text-sm text-sakeenah-400 dark:text-layl-500 text-center py-12">
          No duas yet — add one above, or pick them up during onboarding next time.
        </p>
      )}

      {items.map((item) => (
        <ThikrCard key={item.id} item={item} onUpdate={updateDua} />
      ))}

      <AddThikrModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={saveDua}
        categoryId={SIBHA_CATEGORY_ID}
        isSibha
      />
    </div>
  );
}
