import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Simple on-device storage. No Firebase — all user data stays on the phone.
 * Day 2 will grow this (or move to expo-sqlite) for schedule/meds/messages.
 */

export type UserProfile = {
  name?: string;
  age?: number;
  conditions?: string[];
  medications?: string[];
  routine?: string;
};

const PROFILE_KEY = 'aroha:profile';

export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export async function loadProfile(): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(PROFILE_KEY);
  return raw ? (JSON.parse(raw) as UserProfile) : null;
}

export async function clearAll(): Promise<void> {
  await AsyncStorage.clear();
}
