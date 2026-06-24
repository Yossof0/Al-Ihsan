import { useState } from 'react';
import { setSetting } from '../../db';
import Step1Permissions from './Step1Permissions';
import Step2Location from './Step2Location';
import Step3Notifications from './Step3Notifications';
import Step4Athkar from './Step4Athkar';
import Step5Review from './Step5Review';

const STEPS = [Step1Permissions, Step2Location, Step3Notifications, Step4Athkar, Step5Review];

export default function OnboardingApp({ onComplete }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState({
    locationMode: 'auto',     // 'auto' | 'manual'
    city: '',
    calcMethod: 'MWL',
    offsets: { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 },
    notificationsEnabled: false,
    adhanSound: 'mecca',
    athkarDensity: 'minimal', // 'minimal' | 'full'
    themePref: 'auto',
  });

  const update = (patch) => setData((prev) => ({ ...prev, ...patch }));

  const StepComponent = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  const goNext = async () => {
    if (isLast) {
      await setSetting('locationMode', data.locationMode);
      await setSetting('city', data.city);
      await setSetting('calcMethod', data.calcMethod);
      await setSetting('prayerOffsets', data.offsets);
      await setSetting('notificationsEnabled', data.notificationsEnabled);
      await setSetting('adhanSound', data.adhanSound);
      await setSetting('athkarDensity', data.athkarDensity);
      await setSetting('themeMode', data.themePref);
      await setSetting('onboardingComplete', true);
      onComplete();
      return;
    }
    setStepIndex((i) => i + 1);
  };

  const goBack = () => setStepIndex((i) => Math.max(0, i - 1));

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-sakeenah-50 dark:bg-layl-950 p-6">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-layl-900 shadow-xl border border-sakeenah-200 dark:border-layl-800 p-8 animate-fade-in">
        {/* Progress dots */}
        <div className="flex gap-2 mb-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300
                ${i <= stepIndex ? 'bg-sakeenah-500 dark:bg-layl-500' : 'bg-sakeenah-100 dark:bg-layl-800'}`}
            />
          ))}
        </div>

        <p className="text-xs font-semibold text-sakeenah-400 dark:text-layl-400 mb-1">
          Step {stepIndex + 1} of {STEPS.length}
        </p>

        <StepComponent data={data} update={update} />

        <div className="flex justify-between mt-8">
          <button
            onClick={goBack}
            disabled={stepIndex === 0}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-sakeenah-500 dark:text-layl-300 disabled:opacity-0 hover:bg-sakeenah-50 dark:hover:bg-layl-800 transition"
          >
            Back
          </button>
          <button
            onClick={goNext}
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-sakeenah-500 dark:bg-layl-600 text-white hover:scale-[1.03] active:scale-[0.98] transition-transform shadow-md"
          >
            {isLast ? 'Finish setup' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
