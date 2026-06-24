import { useState, useEffect } from 'react';
import Sidebar, { TABS } from '../src/components/sidebar/Sidebar';
import OnboardingApp from '../src/components/onboarding/OnboardingApp';
import PrayerTimesTab from '../src/components/prayer/PrayerTimesTab';
import { getSetting } from '../src/db';
import { useTheme } from '../src/context/ThemeContext';

export default function NewTabApp() {
  const [active, setActive] = useState('prayer');
  const [onboardingDone, setOnboardingDone] = useState(null); // null = loading
  const { mode, resolved, setThemeMode } = useTheme();
  const current = TABS.find((t) => t.id === active);

  useEffect(() => {
    getSetting('onboardingComplete', false).then(setOnboardingDone);
  }, []);

  if (onboardingDone === null) return null; // avoid flash while checking IndexedDB
  if (!onboardingDone) {
    return <OnboardingApp onComplete={() => setOnboardingDone(true)} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar active={active} onSelect={setActive} />

      <main className="flex-1 overflow-y-auto p-8 animate-fade-in">
        <header className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-extrabold text-sakeenah-800 dark:text-layl-100 flex items-center gap-2">
            <span>{current.icon}</span> {current.label}
          </h2>

          <div className="flex items-center gap-2 text-xs">
            {['auto', 'light', 'dark'].map((m) => (
              <button
                key={m}
                onClick={() => setThemeMode(m)}
                className={`px-3 py-1.5 rounded-full font-semibold capitalize transition-colors
                  ${mode === m
                    ? 'bg-sakeenah-500 dark:bg-layl-600 text-white'
                    : 'bg-sakeenah-100 dark:bg-layl-800 text-sakeenah-600 dark:text-layl-300'}`}
              >
                {m}
              </button>
            ))}
          </div>
        </header>

        {active === 'prayer' ? (
          <PrayerTimesTab />
        ) : (
          <div className="rounded-2xl p-6 bg-white/70 dark:bg-layl-900/60 border border-sakeenah-200 dark:border-layl-800 shadow-sm">
            <p className="text-sakeenah-700 dark:text-layl-200">
              <strong>{current.label}</strong> tab — coming next milestone. Theme is currently resolved to{' '}
              <strong>{resolved}</strong>.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
