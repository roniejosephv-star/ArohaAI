import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadEvents } from './schedule';

const STREAK_KEY = 'aroha:streak';

type StreakData = {
  current: number;
  longest: number;
  lastDate: string;
};

export async function getStreak(): Promise<StreakData> {
  const raw = await AsyncStorage.getItem(STREAK_KEY);
  return raw
    ? (JSON.parse(raw) as StreakData)
    : { current: 0, longest: 0, lastDate: '' };
}

export async function updateStreak(): Promise<StreakData> {
  const streak = await getStreak();
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (streak.lastDate === today) return streak;

  const events = await loadEvents();
  const todayEvents = events.filter((e) => e.date === today);
  const allDone = todayEvents.length > 0 && todayEvents.every((e) => e.completed);

  if (allDone) {
    if (streak.lastDate === yesterday) {
      streak.current += 1;
    } else if (streak.lastDate !== today) {
      streak.current = 1;
    }
    streak.lastDate = today;
    if (streak.current > streak.longest) streak.longest = streak.current;
    await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(streak));
  }

  return streak;
}

export function streakMessage(current: number): string {
  if (current === 0) return '';
  if (current === 1) return '1-day streak! Keep going!';
  if (current < 7) return `${current}-day streak! 🔥`;
  if (current < 30) return `${current}-day streak! Amazing consistency!`;
  return `${current}-day streak! Incredible!`;
}
