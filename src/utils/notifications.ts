import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { getTimeData } from './timeUtils';
import { getBirthYear } from './storage';

const NOTIFICATION_ENABLED_KEY = '@dottime_notifications_enabled';
const NOTIFICATION_TIME_KEY = '@dottime_notification_time';

// Motivational quotes
export const quotes = [
    "Make today count. You only have so many.",
    "Every day is a gift. Use it wisely.",
    "Time is your most valuable currency.",
    "The days are long but the years are short.",
    "Don't count the days, make the days count.",
    "Your time is limited. Don't waste it living someone else's life.",
    "Yesterday is gone. Tomorrow is not promised. Today is yours.",
    "The best time to start was yesterday. The next best time is now.",
    "Life is what happens when you're busy making other plans.",
    "Time you enjoy wasting is not wasted time.",
    "Seize the day. Every moment matters.",
    "You are exactly where you need to be.",
    "Progress, not perfection.",
    "Today is the youngest you'll ever be.",
    "Be present. Be grateful. Be alive.",
    "Small steps lead to big changes.",
    "You have more time than you think. Use it.",
    "This moment is all you have. Make it beautiful.",
    "Breathe. You're doing better than you know.",
    "The dots behind you are proof you've made it this far.",
    "Each day is a new dot. Fill it with intention.",
    "Your future self will thank you for what you do today.",
    "Life isn't about waiting for the storm to pass...",
    "Every sunrise is an invitation to brighten someone's day.",
    "You are the author of your own story.",
];

export const getRandomQuote = (): string => {
    const index = Math.floor(Math.random() * quotes.length);
    return quotes[index];
};

// Notification handlers
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const requestNotificationPermissions = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('daily-reminder', {
            name: 'Daily Reminder',
            importance: Notifications.AndroidImportance.DEFAULT,
            sound: undefined,
        });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    return finalStatus === 'granted';
};

export const scheduleNotification = async (hour: number, minute: number): Promise<void> => {
    await Notifications.cancelAllScheduledNotificationsAsync();

    const birthYear = await getBirthYear() || 1990;
    const timeData = getTimeData('month', birthYear);
    const quote = getRandomQuote();

    await Notifications.scheduleNotificationAsync({
        content: {
            title: `${timeData.remainingDays} days left this month`,
            body: quote,
            sound: undefined,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour,
            minute,
        },
    });
};

export const cancelNotifications = async (): Promise<void> => {
    await Notifications.cancelAllScheduledNotificationsAsync();
};

export const saveNotificationSettings = async (enabled: boolean, hour: number, minute: number): Promise<void> => {
    await AsyncStorage.setItem(NOTIFICATION_ENABLED_KEY, enabled.toString());
    await AsyncStorage.setItem(NOTIFICATION_TIME_KEY, JSON.stringify({ hour, minute }));

    if (enabled) {
        const hasPermission = await requestNotificationPermissions();
        if (hasPermission) {
            await scheduleNotification(hour, minute);
        }
    } else {
        await cancelNotifications();
    }
};

export const getNotificationSettings = async (): Promise<{ enabled: boolean; hour: number; minute: number }> => {
    try {
        const enabled = await AsyncStorage.getItem(NOTIFICATION_ENABLED_KEY);
        const timeStr = await AsyncStorage.getItem(NOTIFICATION_TIME_KEY);
        const time = timeStr ? JSON.parse(timeStr) : { hour: 8, minute: 0 };

        return {
            enabled: enabled === 'true',
            hour: time.hour,
            minute: time.minute,
        };
    } catch {
        return { enabled: false, hour: 8, minute: 0 };
    }
};
