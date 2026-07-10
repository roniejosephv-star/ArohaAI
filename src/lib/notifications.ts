import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('medications', {
        name: 'Medication Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
      });
    }
    return false;
  }
  return true;
}

export async function scheduleMedicationReminders(
  medName: string,
  times: string[]
): Promise<void> {
  const permitted = await requestPermissions();
  if (!permitted) return;

  const existing = await Notifications.getAllScheduledNotificationsAsync();
  const prefix = `med-${medName.toLowerCase().replace(/\s+/g, '-')}`;
  const already = existing.filter((n) => n.identifier.startsWith(prefix));
  for (const n of already) {
    await Notifications.cancelScheduledNotificationAsync(n.identifier);
  }

  for (const timeStr of times) {
    const [h, m] = timeStr.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) continue;

    const trigger: Notifications.TimeIntervalTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 60,
      repeats: false,
    };

    await Notifications.scheduleNotificationAsync({
      identifier: `${prefix}-${timeStr.replace(':', '')}`,
      content: {
        title: '💊 Medication Reminder',
        body: `Time to take ${medName}`,
        sound: 'default',
      },
      trigger,
    });
  }
}

export async function cancelMedicationReminders(medName: string): Promise<void> {
  const prefix = `med-${medName.toLowerCase().replace(/\s+/g, '-')}`;
  const existing = await Notifications.getAllScheduledNotificationsAsync();
  const toCancel = existing.filter((n) => n.identifier.startsWith(prefix));
  for (const n of toCancel) {
    await Notifications.cancelScheduledNotificationAsync(n.identifier);
  }
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
