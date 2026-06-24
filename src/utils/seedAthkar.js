// src/utils/seedAthkar.js
import { getAll, putItem, getSetting } from '../db';
import { DEFAULT_CATEGORIES, DEFAULT_ATHKAR, DEFAULT_SIBHA } from '../data/defaultAthkar';

export async function seedAthkarIfNeeded() {
  const density = await getSetting('athkarDensity', 'minimal');

  const [existingCats, existingAthkar, existingSibha] = await Promise.all([
    getAll('athkarCategories'),
    getAll('athkar'),
    getAll('sibha'),
  ]);
  const existingCatIds = new Set(existingCats.map((c) => c.id));
  const existingAthkarIds = new Set(existingAthkar.map((a) => a.id));
  const existingSibhaIds = new Set(existingSibha.map((a) => a.id));

  for (const cat of DEFAULT_CATEGORIES) {
    if (!existingCatIds.has(cat.id)) await putItem('athkarCategories', cat);
  }

  for (const item of DEFAULT_ATHKAR) {
    if (density === 'minimal' && !item.inMinimalSet) continue;
    if (!existingAthkarIds.has(item.id)) await putItem('athkar', item);
  }

  for (const item of DEFAULT_SIBHA) {
    if (density === 'minimal' && !item.inMinimalSet) continue;
    if (!existingSibhaIds.has(item.id)) await putItem('sibha', item);
  }
}

export async function getCategoriesWithCounts() {
  const [categories, athkar] = await Promise.all([getAll('athkarCategories'), getAll('athkar')]);
  return categories
    .filter((c) => !c.isSibha)
    .map((c) => ({ ...c, count: athkar.filter((a) => a.categoryId === c.id).length }));
}
