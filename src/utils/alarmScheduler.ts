import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import type { AlarmItem } from "@/components/alarm/AlarmCard";

/** Raw sound file (registered in app.json -> expo-notifications -> sounds). */
export const ALARM_SOUND = "morning_melody.wav";

/**
 * Android notification channel settings (sound/importance) are immutable once the
 * channel is created, so the id is versioned. Bump it whenever the sound changes.
 */
export const ALARM_CHANNEL_ID = "alarm-melody-v3";
const LEGACY_CHANNEL_IDS = ["alarm-channel", "alarm-melody-v1", "alarm-melody-v2"];

/** expo-notifications weekday numbers: 1 = Sunday ... 7 = Saturday */
const WEEKDAY_NUMBER: Record<string, number> = {
  Sun: 1,
  Mon: 2,
  Tue: 3,
  Wed: 4,
  Thu: 5,
  Fri: 6,
  Sat: 7,
};

export const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Ask for notification permission (if needed). Returns true when granted. */
export async function ensureNotificationPermission(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

/** Create the high-importance alarm channel that plays the custom melody. */
export async function configureAlarmChannel(): Promise<void> {
  if (Platform.OS !== "android") return;

  for (const legacyId of LEGACY_CHANNEL_IDS) {
    await Notifications.deleteNotificationChannelAsync(legacyId).catch(() => {});
  }

  await Notifications.setNotificationChannelAsync(ALARM_CHANNEL_ID, {
    name: "Alarms",
    description: "Alarm melody and reminders",
    importance: Notifications.AndroidImportance.MAX,
    sound: ALARM_SOUND,
    // Play through the alarm volume stream rather than the notification stream.
    audioAttributes: {
      usage: Notifications.AndroidAudioUsage.ALARM,
      contentType: Notifications.AndroidAudioContentType.SONIFICATION,
    },
    vibrationPattern: [0, 500, 300, 500, 300, 500],
    enableVibrate: true,
    enableLights: true,
    lightColor: "#FFB66B20",
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    bypassDnd: false,
  });
}

/** Convert "03:35" + "PM" into 24-hour { hour, minute }. */
export function to24Hour(time: string, period: "AM" | "PM") {
  const [hourStr, minuteStr] = time.split(":");
  let hour = parseInt(hourStr, 10) || 0;
  const minute = parseInt(minuteStr, 10) || 0;
  if (period === "PM" && hour < 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  return { hour, minute };
}

/** Extract the selected weekdays (Mon..Sun) from an alarm. */
export function getAlarmDays(alarm: AlarmItem): string[] {
  if (alarm.days) return alarm.days;
  if (alarm.repeat.includes("Every day")) return ALL_DAYS;
  return ALL_DAYS.filter((day) => alarm.repeat.includes(day));
}

/** Cancel every scheduled notification that belongs to the given alarm. */
export async function cancelAlarm(alarmId: string): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((n) => n.content.data?.alarmId === alarmId)
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
  );
}

/** Schedule an alarm: daily, on specific weekdays, or once at the next occurrence. */
export async function scheduleAlarm(alarm: AlarmItem): Promise<void> {
  // Always start clean so toggling / rescheduling never creates duplicates.
  await cancelAlarm(alarm.id);

  const { hour, minute } = to24Hour(alarm.time, alarm.period);
  const days = getAlarmDays(alarm);

  const content: Notifications.NotificationContentInput = {
    title: `${alarm.iconEmoji ?? "⏰"} ${alarm.titleZh}`,
    body: alarm.note ? `${alarm.titleEn} — ${alarm.note}` : alarm.titleEn,
    sound: ALARM_SOUND, // used on iOS and Android < 8 (Android 8+ uses the channel sound)
    priority: Notifications.AndroidNotificationPriority.MAX,
    vibrate: [0, 500, 300, 500, 300, 500],
    data: { alarmId: alarm.id },
  };

  if (days.length === 7) {
    await Notifications.scheduleNotificationAsync({
      identifier: `${alarm.id}_daily`,
      content,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        channelId: ALARM_CHANNEL_ID,
      },
    });
  } else if (days.length > 0) {
    await Promise.all(
      days.map((day) =>
        Notifications.scheduleNotificationAsync({
          identifier: `${alarm.id}_${day}`,
          content,
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            weekday: WEEKDAY_NUMBER[day],
            hour,
            minute,
            channelId: ALARM_CHANNEL_ID,
          },
        })
      )
    );
  } else {
    const next = new Date();
    next.setHours(hour, minute, 0, 0);
    if (next.getTime() <= Date.now()) next.setDate(next.getDate() + 1);
    await Notifications.scheduleNotificationAsync({
      identifier: `${alarm.id}_once`,
      content,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: next,
        channelId: ALARM_CHANNEL_ID,
      },
    });
  }
}

/** Rebuild the schedule from scratch so it always mirrors the current alarm list. */
export async function syncAlarms(alarms: AlarmItem[]): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Promise.all(alarms.filter((a) => a.enabled).map(scheduleAlarm));
}
