import { useEffect, useState } from 'react';
import { getItem, putItem, getAll, getSetting, setSetting } from '../../db';
import {
  fetchJuz,
  fetchTranslationEditions,
  fetchTranslationText,
  POPULAR_RECITERS,
  downloadSurahAudio,
} from '../../utils/quranApi';

const ARABIC_FONTS = [
  { id: 'Lateef', label: 'Lateef' },
  { id: 'Amiri', label: 'Amiri' },
];

export default function QuranTab() {
  const [ayahs, setAyahs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [fontFamily, setFontFamily] = useState('Lateef');
  const [fontSize, setFontSize] = useState(28);
  const [showReciters, setShowReciters] = useState(false);

  const [translations, setTranslations] = useState([]);
  const [downloadedIds, setDownloadedIds] = useState([]);
  const [activeTranslation, setActiveTranslation] = useState(null);
  const [translationText, setTranslationText] = useState(null);
  const [translationBusy, setTranslationBusy] = useState(null); // edition id currently downloading

  // Load cached Juz 1, or fetch + cache it if this is the first time online.
  useEffect(() => {
    (async () => {
      try {
        const cached = await getItem('quranArabic', 'juz-1');
        if (cached) {
          setAyahs(cached.ayahs);
        } else {
          const fresh = await fetchJuz(1);
          await putItem('quranArabic', { key: 'juz-1', ayahs: fresh });
          setAyahs(fresh);
        }
      } catch (e) {
        setError(e.message || 'Could not load the Quran text. Connect once to cache it offline.');
      } finally {
        setLoading(false);
      }
    })();

    getSetting('quranFont', 'Lateef').then(setFontFamily);
    getSetting('quranFontSize', 28).then(setFontSize);
    getAll('quranTranslations').then((rows) => setDownloadedIds(rows.map((r) => r.id)));

    fetchTranslationEditions().then(setTranslations).catch(() => setTranslations([]));
  }, []);

  const updateFont = (f) => { setFontFamily(f); setSetting('quranFont', f); };
  const updateFontSize = (s) => { setFontSize(s); setSetting('quranFontSize', s); };

  const downloadTranslation = async (editionId) => {
    setTranslationBusy(editionId);
    try {
      const text = await fetchTranslationText(editionId);
      await putItem('quranTranslations', { id: editionId, ayahs: text });
      setDownloadedIds((d) => [...d, editionId]);
    } catch (e) {
      alert(e.message || 'Download failed — check your connection.');
    } finally {
      setTranslationBusy(null);
    }
  };

  const toggleTranslation = async (editionId) => {
    if (activeTranslation === editionId) {
      setActiveTranslation(null);
      setTranslationText(null);
      return;
    }
    const row = await getItem('quranTranslations', editionId);
    setActiveTranslation(editionId);
    setTranslationText(row?.ayahs || []);
  };

  const translationFor = (ayahNumber) =>
    translationText?.find((t) => t.number === ayahNumber)?.text;

  if (loading) return <p className="text-sakeenah-500 dark:text-layl-400 animate-pulse">Loading Quran text…</p>;
  if (error) return <p className="text-amber-600">{error}</p>;

  const surahGroups = [];
  for (const a of ayahs) {
    let group = surahGroups.find((g) => g.surahNumber === a.surahNumber);
    if (!group) {
      group = { surahNumber: a.surahNumber, surahName: a.surahName, ayahs: [] };
      surahGroups.push(group);
    }
    group.ayahs.push(a);
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Reader controls */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl p-3 bg-sakeenah-50 dark:bg-layl-900/60 border border-sakeenah-200 dark:border-layl-800">
        <div className="flex items-center gap-2">
          <span className="text-xs text-sakeenah-500 dark:text-layl-400">Font</span>
          {ARABIC_FONTS.map((f) => (
            <button
              key={f.id}
              onClick={() => updateFont(f.id)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${fontFamily === f.id ? 'bg-sakeenah-500 dark:bg-layl-600 text-white' : 'bg-white dark:bg-layl-800 text-sakeenah-700 dark:text-layl-200'}`}
              style={{ fontFamily: f.id }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-sakeenah-500 dark:text-layl-400">Size</span>
          <input type="range" min={20} max={44} value={fontSize} onChange={(e) => updateFontSize(Number(e.target.value))} />
        </div>

        <button
          onClick={() => setShowReciters((s) => !s)}
          className="ml-auto px-3 py-1.5 rounded-lg text-xs font-semibold bg-sakeenah-500 dark:bg-layl-600 text-white"
        >
          {showReciters ? 'Hide reciters' : 'Download recitation'}
        </button>
      </div>

      {/* Translations */}
      {translations.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {translations.slice(0, 6).map((t) => {
            const downloaded = downloadedIds.includes(t.id);
            const active = activeTranslation === t.id;
            return (
              <button
                key={t.id}
                onClick={() => (downloaded ? toggleTranslation(t.id) : downloadTranslation(t.id))}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors
                  ${active ? 'bg-gold-500 text-white' : downloaded
                    ? 'bg-sakeenah-100 dark:bg-layl-800 text-sakeenah-700 dark:text-layl-200'
                    : 'bg-sakeenah-50 dark:bg-layl-900 text-sakeenah-500 dark:text-layl-400 border border-dashed border-sakeenah-300 dark:border-layl-700'}`}
              >
                {translationBusy === t.id ? 'Downloading…' : downloaded ? t.name : `↓ ${t.name}`}
              </button>
            );
          })}
        </div>
      )}

      {/* Reciters panel */}
      {showReciters && (
        <div className="rounded-2xl p-4 bg-white dark:bg-layl-900/60 border border-sakeenah-200 dark:border-layl-800 space-y-2">
          <p className="text-xs text-sakeenah-500 dark:text-layl-400 mb-2">
            Downloads Surah Al-Fatihah (Juz 1's first surah) as a sample — saved to your Downloads/Al-Ihsan folder.
          </p>
          {POPULAR_RECITERS.map((r) => (
            <div key={r.id} className="flex items-center justify-between">
              <span className="text-sm text-sakeenah-700 dark:text-layl-200">{r.name}</span>
              <button
                onClick={() => downloadSurahAudio(r.id, 1, r.name)}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-sakeenah-100 dark:bg-layl-800 text-sakeenah-700 dark:text-layl-200 hover:bg-sakeenah-200 dark:hover:bg-layl-700"
              >
                Download
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Reader — grouped by surah */}
      <div className="rounded-2xl p-6 bg-white dark:bg-layl-900/60 border border-sakeenah-200 dark:border-layl-800 space-y-8">
        {surahGroups.map((group) => (
          <div key={group.surahNumber}>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-sakeenah-200 dark:border-layl-800">
              <div>
                <p className="text-lg font-extrabold text-sakeenah-800 dark:text-layl-100">
                  {group.surahNumber}. {group.surahName}
                </p>
                <p className="text-xs text-sakeenah-400 dark:text-layl-500">{group.ayahs.length} ayahs in this section</p>
              </div>
            </div>

            <div dir="rtl" style={{ fontFamily, fontSize: `${fontSize}px` }} className="leading-loose text-sakeenah-900 dark:text-layl-50">
              {group.ayahs.map((a) => (
                <span key={a.number} className="inline">
                  {a.text}{' '}
                  <span className="text-sakeenah-400 dark:text-layl-500 text-base">({a.numberInSurah})</span>{' '}
                </span>
              ))}
            </div>

            {activeTranslation && (
              <div className="mt-5 pt-5 border-t border-sakeenah-200 dark:border-layl-800 space-y-2 text-left" dir="ltr">
                {group.ayahs.map((a) => (
                  <p key={a.number} className="text-sm text-sakeenah-600 dark:text-layl-300">
                    <span className="font-semibold text-sakeenah-400 dark:text-layl-500">{a.numberInSurah}.</span>{' '}
                    {translationFor(a.number) || '…'}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
