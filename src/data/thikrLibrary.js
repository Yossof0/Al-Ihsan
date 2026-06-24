// src/data/thikrLibrary.js
// A larger reference pool of common athkar/duas the user can pick from
// in the "+ Thikr" library tab, separate from what's seeded by default.
// Picking one copies it into the active category with a fresh id.

export const THIKR_LIBRARY = [
  { text: 'سُبْحَانَ اللَّهِ', transliteration: 'Subhanallah', count: 33, reward: 'A tree is planted for you in Paradise with every utterance.', proof: 'Reported by Muslim, Hadith 2698.', moodTags: ['grateful', 'calm'] },
  { text: 'الْحَمْدُ لِلَّهِ', transliteration: 'Alhamdulillah', count: 33, reward: 'Fills the scale of good deeds on the Day of Judgment.', proof: 'Reported by Muslim, Hadith 223.', moodTags: ['happy', 'grateful'] },
  { text: 'اللَّهُ أَكْبَرُ', transliteration: 'Allahu Akbar', count: 34, reward: 'Completes the tasbih of 100, erasing sins like leaves falling from a tree.', proof: 'Reported by Muslim, Hadith 2698.', moodTags: ['calm'] },
  { text: 'أَسْتَغْفِرُ اللَّهَ', transliteration: 'Astaghfirullah', count: 100, reward: 'Seeking forgiveness opens doors of provision and ease.', proof: "Qur'an 71:10-12.", moodTags: ['sad', 'anxious'] },
  { text: 'لَا إِلَٰهَ إِلَّا اللَّهُ', transliteration: 'La ilaha illallah', count: 100, reward: 'The best of all remembrance — the testimony of faith itself.', proof: 'Reported by al-Tirmidhi; graded good.', moodTags: ['sad', 'calm'] },
  { text: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ', transliteration: 'Allahumma salli ala Muhammad', count: 100, reward: 'Allah sends ten blessings on whoever sends one blessing on the Prophet ﷺ.', proof: 'Reported by Muslim, Hadith 384.', moodTags: ['happy', 'grateful'] },
  { text: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', transliteration: 'La hawla wa la quwwata illa billah', count: 1, reward: 'A treasure from the treasures of Paradise.', proof: 'Reported by al-Bukhari and Muslim.', moodTags: ['angry', 'anxious'] },
  { text: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', transliteration: "Hasbunallahu wa ni'mal wakeel", count: 7, reward: 'A declaration that Allah alone suffices, said by the Prophets in their hardest moments.', proof: "Qur'an 3:173.", moodTags: ['sad', 'anxious'] },
  { text: 'رَبِّ اشْرَحْ لِي صَدْرِي', transliteration: 'Rabbi-shrah li sadri', count: 1, reward: "Musa's supplication for ease when facing a difficult task ahead.", proof: "Qur'an 20:25-26.", moodTags: ['anxious'] },
  { text: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً', transliteration: 'Rabbana atina fid-dunya hasanah', count: 1, reward: 'A comprehensive request for good in this life and the next.', proof: "Qur'an 2:201.", moodTags: ['grateful', 'happy'] },
  { text: 'اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي', transliteration: "Allahumma ghfir li warhamni", count: 1, reward: "Combines a request for forgiveness and mercy in one short line.", proof: 'Reported by Abu Dawud and others.', moodTags: ['sad'] },
  { text: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ', transliteration: 'Ya Hayyu ya Qayyum birahmatika astagheeth', count: 1, reward: 'A direct call on Allah\'s eternal, sustaining names in moments of need.', proof: 'Reported by al-Tirmidhi and al-Hakim; graded good.', moodTags: ['anxious', 'sad'] },
  { text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ', transliteration: 'Allahumma inni as-aluka al-afiyah', count: 3, reward: 'A general supplication for wellbeing in body, mind, and faith.', proof: 'Reported by Abu Dawud and Ibn Majah.', moodTags: ['calm', 'anxious'] },
];
