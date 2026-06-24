// src/utils/reminderScheduler.js
// Each reminder slot gets its own chrome.alarms entry named `reminder-<id>`.
// The actual notification firing happens in the background service worker
// (public/background.js), which reads reminder + thikr data straight from
// IndexedDB when its alarm fires — this file only manages registration.

export function alarmNameFor(reminderId) {
  return `reminder-${reminderId}`;
}

export async function scheduleReminder(reminder) {
  if (!chrome?.alarms) return; // not running inside the extension (e.g. plain browser preview)
  const name = alarmNameFor(reminder.id);
  await chrome.alarms.clear(name);
  if (!reminder.enabled) return;
  chrome.alarms.create(name, {
    delayInMinutes: reminder.intervalMinutes,
    periodInMinutes: reminder.intervalMinutes,
  });
}

export async function cancelReminder(reminderId) {
  if (!chrome?.alarms) return;
  await chrome.alarms.clear(alarmNameFor(reminderId));
}

export async function rescheduleAll(reminders) {
  if (!chrome?.alarms) return;
  await chrome.alarms.clearAll();
  for (const r of reminders.filter((r) => r.enabled)) {
    await scheduleReminder(r);
  }
}
