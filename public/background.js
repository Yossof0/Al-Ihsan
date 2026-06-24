// public/background.js
// MV3 service worker. Listens for chrome.alarms created by the reminder
// scheduler (src/utils/reminderScheduler.js) and shows a notification with
// the linked thikr's text. Talks to IndexedDB directly since service
// workers can't import the React app's modules.

const DB_NAME = 'al-ihsan';
const DB_VERSION = 2;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function getAllFromStore(db, storeName) {
  return new Promise((resolve, reject) => {
    const req = db.transaction(storeName, 'readonly').objectStore(storeName).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

function getOneFromStore(db, storeName, key) {
  return new Promise((resolve, reject) => {
    const req = db.transaction(storeName, 'readonly').objectStore(storeName).get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (!alarm.name.startsWith('reminder-')) return;
  const reminderId = alarm.name.replace('reminder-', '');

  try {
    const db = await openDB();
    const reminder = await getOneFromStore(db, 'reminders', reminderId);
    if (!reminder || !reminder.enabled) return;

    const [athkar, sibha] = await Promise.all([
      getAllFromStore(db, 'athkar'),
      getAllFromStore(db, 'sibha'),
    ]);
    const pool = [...athkar, ...sibha];

    const candidates = pool.filter((item) => reminder.thikrIds?.includes(item.id));
    if (candidates.length === 0) return;

    const pick = candidates[Math.floor(Math.random() * candidates.length)];

    chrome.notifications.create(`thikr-${Date.now()}`, {
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: reminder.title || 'Thikr Reminder',
      message: `${pick.text}${pick.transliteration ? `\n(${pick.transliteration})` : ''}`,
      priority: 1,
    });
  } catch (err) {
    // Service workers can't surface errors to a UI — log only.
    console.error('[Al-Ihsan] reminder alarm failed', err);
  }
});
