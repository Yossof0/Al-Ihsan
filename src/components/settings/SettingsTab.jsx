import { useEffect, useState } from 'react';
import { getSetting, setSetting } from '../../db';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export default function SettingsTab() {
  const { mode, setThemeMode } = useTheme();
  const { language, setLanguage: updateLanguage, t } = useLanguage();
  const [athkarDensity, setAthkarDensity] = useState('minimal');
  const [locationMode, setLocationMode] = useState('auto');
  const [city, setCity] = useState('');

  useEffect(() => {
    getSetting('athkarDensity', 'minimal').then(setAthkarDensity);
    getSetting('locationMode', 'auto').then(setLocationMode);
    getSetting('city', '').then(setCity);
  }, []);

  const updateDensity = (d) => { setAthkarDensity(d); setSetting('athkarDensity', d); };
  const updateLocationMode = (m) => { setLocationMode(m); setSetting('locationMode', m); };
  const updateCity = (c) => { setCity(c); setSetting('city', c); };

  return (
    <div className="space-y-6 animate-fade-in max-w-xl">
      <SettingBlock title={t('settings_language')}>
        <Pills
          options={[{ id: 'en', label: 'English' }, { id: 'ar', label: 'العربية' }]}
          value={language}
          onChange={updateLanguage}
        />
      </SettingBlock>

      <SettingBlock title={t('settings_theme')}>
        <Pills
          options={[{ id: 'auto', label: 'Auto' }, { id: 'light', label: 'Light' }, { id: 'dark', label: 'Dark' }]}
          value={mode}
          onChange={setThemeMode}
        />
      </SettingBlock>

      <SettingBlock title={t('settings_location')}>
        <Pills
          options={[{ id: 'auto', label: 'Automatic' }, { id: 'manual', label: 'Manual city' }]}
          value={locationMode}
          onChange={updateLocationMode}
        />
        {locationMode === 'manual' && (
          <input
            value={city}
            onChange={(e) => updateCity(e.target.value)}
            placeholder="e.g. Cairo, Egypt"
            className="mt-3 w-full px-3 py-2 rounded-xl bg-sakeenah-50 dark:bg-layl-800 border border-sakeenah-200 dark:border-layl-700 text-sm outline-none focus:ring-2 focus:ring-sakeenah-400"
          />
        )}
      </SettingBlock>

      <SettingBlock title={t('settings_athkar_density')}>
        <Pills
          options={[{ id: 'minimal', label: 'Minimal' }, { id: 'full', label: 'Full set' }]}
          value={athkarDensity}
          onChange={updateDensity}
        />
        <p className="text-xs text-sakeenah-400 dark:text-layl-500 mt-2">
          Only affects new categories seeded going forward — won't remove what you already have.
        </p>
      </SettingBlock>
    </div>
  );
}

function SettingBlock({ title, children }) {
  return (
    <div className="rounded-2xl p-4 bg-white dark:bg-layl-900/60 border border-sakeenah-200 dark:border-layl-800">
      <p className="text-sm font-bold text-sakeenah-800 dark:text-layl-100 mb-2">{title}</p>
      {children}
    </div>
  );
}

function Pills({ options, value, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors
            ${value === o.id ? 'bg-sakeenah-500 dark:bg-layl-600 text-white' : 'bg-sakeenah-50 dark:bg-layl-800 text-sakeenah-700 dark:text-layl-200'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
