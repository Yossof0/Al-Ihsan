import { useEffect, useState } from 'react';
import { getAll } from '../../db';
import { seedAthkarIfNeeded } from '../../utils/seedAthkar';
import ThikrCard from '../athkar/ThikrCard';

const MOODS = [
  { id: 'happy', label: 'Happy', icon: '😊' },
  { id: 'sad', label: 'Sad', icon: '😔' },
  { id: 'angry', label: 'Angry', icon: '😤' },
  { id: 'anxious', label: 'Anxious', icon: '😟' },
  { id: 'grateful', label: 'Grateful', icon: '🤲' },
  { id: 'calm', label: 'Calm', icon: '🌿' },
];

export default function MoodAthkarTab() {
  const [mood, setMood] = useState(null);
  const [allItems, setAllItems] = useState([]);

  useEffect(() => {
    seedAthkarIfNeeded().then(async () => {
      const [athkar, sibha] = await Promise.all([getAll('athkar'), getAll('sibha')]);
      setAllItems([...athkar, ...sibha]);
    });
  }, []);

  const matches = mood
    ? allItems.filter((i) => (i.moodTags || []).includes(mood)).sort((a, b) => a.order - b.order)
    : [];

  return (
    <div className="animate-fade-in">
      <p className="text-sm text-sakeenah-600 dark:text-layl-300 mb-4">
        How are you feeling right now? Pick a mood and we'll surface athkar and duas suited to it.
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
        {MOODS.map((m) => (
          <button
            key={m.id}
            onClick={() => setMood(m.id)}
            className={`flex flex-col items-center gap-1 py-3 rounded-2xl text-sm font-semibold transition-all duration-200
              ${mood === m.id
                ? 'bg-sakeenah-500 dark:bg-layl-600 text-white scale-[1.04] shadow-md'
                : 'bg-sakeenah-50 dark:bg-layl-800/60 text-sakeenah-700 dark:text-layl-200 hover:scale-[1.02]'}`}
          >
            <span className="text-xl">{m.icon}</span>
            {m.label}
          </button>
        ))}
      </div>

      {mood && matches.length === 0 && (
        <p className="text-sm text-sakeenah-400 dark:text-layl-500 text-center py-10">
          Nothing tagged for "{MOODS.find((m) => m.id === mood)?.label}" yet — add mood tags when creating a thikr or dua and it'll show up here.
        </p>
      )}

      <div className="space-y-3">
        {matches.map((item) => (
          <ThikrCard key={item.id} item={item} displayMode={item.displayMode || 'rect'} />
        ))}
      </div>
    </div>
  );
}
