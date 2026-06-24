// src/db/index.js
// Lightweight IndexedDB wrapper for Al-Ihsan.
// Single database, one object store per "table". No external deps.

const DB_NAME = 'al-ihsan';
const DB_VERSION = 2;

// Object stores created on first install. Add new stores here and bump
// DB_VERSION when you need a migration.
const STORES = [
  { name: 'settings', keyPath: 'key' },           // theme, fonts, onboarding flags
  { name: 'prayerConfig', keyPath: 'prayer' },     // per-prayer offsets/notif/adhan
  { name: 'athkarCategories', keyPath: 'id' },
  { name: 'athkar', keyPath: 'id' },               // text, order, count, reward, proof, moodTags[]
  { name: 'sibha', keyPath: 'id' },
  { name: 'reminders', keyPath: 'id' },
  { name: 'todoColumns', keyPath: 'id' },
  { name: 'todoCards', keyPath: 'id' },
  { name: 'quranTranslations', keyPath: 'id' },    // downloaded translation packs
  { name: 'quranArabic', keyPath: 'key' },         // cached Arabic text, keyed e.g. 'juz-1'
  { name: 'quranProgress', keyPath: 'key' },
];

let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      for (const store of STORES) {
        if (!db.objectStoreNames.contains(store.name)) {
          db.createObjectStore(store.name, { keyPath: store.keyPath });
        }
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

function tx(storeName, mode = 'readonly') {
  return openDB().then((db) => db.transaction(storeName, mode).objectStore(storeName));
}

/** Get a single record by its keyPath value. */
export async function getItem(storeName, key) {
  const store = await tx(storeName);
  return new Promise((resolve, reject) => {
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}

/** Get every record in a store. */
export async function getAll(storeName) {
  const store = await tx(storeName);
  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result ?? []);
    req.onerror = () => reject(req.error);
  });
}

/** Insert or update a record. Record must include the store's keyPath field. */
export async function putItem(storeName, value) {
  const store = await tx(storeName, 'readwrite');
  return new Promise((resolve, reject) => {
    const req = store.put(value);
    req.onsuccess = () => resolve(value);
    req.onerror = () => reject(req.error);
  });
}

/** Delete a record by key. */
export async function deleteItem(storeName, key) {
  const store = await tx(storeName, 'readwrite');
  return new Promise((resolve, reject) => {
    const req = store.delete(key);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

/** Convenience: get a settings value with a fallback default. */
export async function getSetting(key, fallback = null) {
  const row = await getItem('settings', key);
  return row ? row.value : fallback;
}

/** Convenience: set a single settings value. */
export async function setSetting(key, value) {
  return putItem('settings', { key, value });
}

export const STORE_NAMES = STORES.map((s) => s.name);
