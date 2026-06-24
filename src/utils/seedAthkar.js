// src/utils/seedAthkar.js
import { getAll, putItem, getSetting, setSetting } from '../db';
import { DEFAULT_CATEGORIES, DEFAULT_ATHKAR, DEFAULT_SIBHA } from '../data/defaultAthkar';

export async function seedAthkarIfNeeded() {
  const alreadySeeded = await getSetting('athkarSeeded', false);
  if (alreadySeeded) return;

  const density = await getSetting('athkarDensity', 'minimal');

  for (const cat of DEFAULT_CATEGORIES) {
    await putItem('athkarCategories', cat);
  }

  const items = [...DEFAULT_ATHKAR, ...DEFAULT_SIBHA];
  for (const item of items) {
    if (density === 'minimal' && !item.inMinimalSet) continue;
    const target = item.categoryId === 'cat-sibha' ? 'sibha' : 'athkar';
    await putItem(target, item);
  }

  await setSetting('athkarSeeded', true);
}

export async function getCategoriesWithCounts() {
  const [categories, athkar] = await Promise.all([getAll('athkarCategories'), getAll('athkar')]);
  return categories
    .filter((c) => !c.isSibha)
    .map((c) => ({ ...c, count: athkar.filter((a) => a.categoryId === c.id).length }));
}
