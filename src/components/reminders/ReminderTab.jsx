import { useEffect, useState } from 'react';
import { getAll, putItem, deleteItem } from '../../db';
import { scheduleReminder, cancelReminder } from '../../utils/reminderScheduler';
import ThikrPickerModal from './ThikrPickerModal';

export default function ReminderTab() {
  const [reminders, setReminders] = useState([]);
  const [pool, setPool] = useState([]);
  const [pickerFor, setPickerFor] = useState(null); // reminder id currently being edited

  const refresh = async () => {
    const [rems, athkar, sibha] = await Promise.all([getAll('reminders'), getAll('athkar'), getAll('sibha')]);
    setReminders(rems);
    setPool([...athkar, ...sibha]);
  };

  useEffect(() => { refresh(); }, []);

  const addReminder = async () => {
    const reminder = {
      id: `rem-${Date.now()}`,
      title: 'New Reminder',
      intervalMinutes: 60,
      thikrIds: [],
      enabled: false, // off until thikr are picked
    };
    await putItem('reminders', reminder);
    refresh();
  };

  const updateReminder = async (reminder, patch) => {
    const updated = { ...reminder, ...patch };
    await putItem('reminders', updated);
    await scheduleReminder(updated);
    refresh();
  };

  const removeReminder = async (id) => {
    await cancelReminder(id);
    await deleteItem('reminders', id);
    refresh();
  };

  const thikrLabel = (id) => pool.find((p) => p.id === id)?.transliteration || pool.find((p) => p.id === id)?.text;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-end">
        <button
          onClick={addReminder}
          className="px-4 py-2 rounded-xl text-sm font-bold bg-sakeenah-500 dark:bg-layl-600 text-white hover:scale-105 transition-transform"
        >
          + Reminder
        </button>
      </div>

      {reminders.length === 0 && (
        <p className="text-sm text-sakeenah-400 dark:text-layl-500 text-center py-12">
          No reminders set up yet — add one to get periodic thikr notifications.
        </p>
      )}

      {reminders.map((rem) => (
        <div key={rem.id} className="rounded-2xl p-4 bg-white dark:bg-layl-900/60 border border-sakeenah-200 dark:border-layl-800">
          <div className="flex items-center justify-between mb-3">
            <input
              value={rem.title}
              onChange={(e) => updateReminder(rem, { title: e.target.value })}
              className="font-bold text-sakeenah-800 dark:text-layl-100 bg-transparent outline-none border-b border-transparent focus:border-sakeenah-300 dark:focus:border-layl-600"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateReminder(rem, { enabled: !rem.enabled })}
                disabled={rem.thikrIds.length === 0}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors disabled:opacity-30
                  ${rem.enabled ? 'bg-sakeenah-500 dark:bg-layl-600' : 'bg-sakeenah-200 dark:bg-layl-700'}`}
              >
                <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${rem.enabled ? 'translate-x-5' : ''}`} />
              </button>
              <button onClick={() => removeReminder(rem.id)} className="text-sakeenah-400 dark:text-layl-500 hover:text-red-500 text-sm">
                ✕
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-sakeenah-500 dark:text-layl-400">Every</span>
            <input
              type="number"
              min={1}
              value={rem.intervalMinutes}
              onChange={(e) => updateReminder(rem, { intervalMinutes: Number(e.target.value) })}
              className="w-20 px-2 py-1 rounded-lg text-sm text-center bg-sakeenah-50 dark:bg-layl-800 border border-sakeenah-200 dark:border-layl-700"
            />
            <span className="text-xs text-sakeenah-500 dark:text-layl-400">minutes</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap mb-2">
            {rem.thikrIds.length === 0 ? (
              <span className="text-xs text-sakeenah-400 dark:text-layl-500">No thikr picked yet</span>
            ) : (
              rem.thikrIds.map((id) => (
                <span key={id} className="text-xs px-2.5 py-1 rounded-full bg-sakeenah-100 dark:bg-layl-800 text-sakeenah-700 dark:text-layl-200">
                  {thikrLabel(id) || '…'}
                </span>
              ))
            )}
          </div>

          <button
            onClick={() => setPickerFor(rem.id)}
            className="text-sm font-semibold text-sakeenah-600 dark:text-layl-300"
          >
            {rem.thikrIds.length ? 'Edit selection' : 'Pick thikr'}
          </button>
        </div>
      ))}

      <ThikrPickerModal
        open={!!pickerFor}
        onClose={() => setPickerFor(null)}
        selectedIds={reminders.find((r) => r.id === pickerFor)?.thikrIds || []}
        onConfirm={(ids) => {
          const rem = reminders.find((r) => r.id === pickerFor);
          updateReminder(rem, { thikrIds: ids });
        }}
      />
    </div>
  );
}
