import { useState } from 'react';

export default function Step1Permissions({ data, update }) {
  const [locStatus, setLocStatus] = useState('idle'); // idle | granted | denied
  const [notifStatus, setNotifStatus] = useState('idle');

  const requestLocation = () => {
    setLocStatus('asking');
    navigator.geolocation.getCurrentPosition(
      () => { setLocStatus('granted'); update({ locationMode: 'auto' }); },
      () => { setLocStatus('denied'); update({ locationMode: 'manual' }); }
    );
  };

  const requestNotifications = async () => {
    setNotifStatus('asking');
    try {
      const result = await Notification.requestPermission();
      setNotifStatus(result === 'granted' ? 'granted' : 'denied');
      update({ notificationsEnabled: result === 'granted' });
    } catch {
      setNotifStatus('denied');
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-extrabold text-sakeenah-800 dark:text-layl-100 mb-2">
        Welcome to Al-Ihsan 🌙
      </h2>
      <p className="text-sm text-sakeenah-600 dark:text-layl-300 mb-6">
        Two quick permissions so prayer times and reminders work properly. You can change these later in Settings.
      </p>

      <PermissionRow
        title="Location"
        desc="Used to calculate accurate prayer times for where you are."
        status={locStatus}
        onRequest={requestLocation}
      />
      <PermissionRow
        title="Notifications"
        desc="Used for prayer alerts and thikr reminders."
        status={notifStatus}
        onRequest={requestNotifications}
      />
    </div>
  );
}

function PermissionRow({ title, desc, status, onRequest }) {
  const badge = {
    idle: null,
    asking: <span className="text-xs text-sakeenah-400">Asking…</span>,
    granted: <span className="text-xs font-semibold text-sakeenah-600 dark:text-layl-300">✓ Granted</span>,
    denied: <span className="text-xs font-semibold text-amber-600">Skipped — can set manually later</span>,
  }[status];

  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-sakeenah-50 dark:bg-layl-800/60 mb-3">
      <div>
        <p className="font-semibold text-sakeenah-800 dark:text-layl-100 text-sm">{title}</p>
        <p className="text-xs text-sakeenah-500 dark:text-layl-400">{desc}</p>
      </div>
      {status === 'idle' ? (
        <button
          onClick={onRequest}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-sakeenah-500 dark:bg-layl-600 text-white hover:scale-105 transition-transform shrink-0"
        >
          Allow
        </button>
      ) : badge}
    </div>
  );
}
