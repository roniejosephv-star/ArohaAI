import AsyncStorage from '@react-native-async-storage/async-storage';

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type UserProfile = {
  name?: string;
  age?: number;
  conditions?: string[];
  medications?: string[];
  routine?: string;
};

const PROFILE_KEY = 'aroha:profile';
const MESSAGES_KEY = 'aroha:messages';

export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export async function loadProfile(): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(PROFILE_KEY);
  return raw ? (JSON.parse(raw) as UserProfile) : null;
}

export async function saveMessages(messages: ChatMessage[]): Promise<void> {
  await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}

export async function loadMessages(): Promise<ChatMessage[]> {
  const raw = await AsyncStorage.getItem(MESSAGES_KEY);
  return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
}

export async function clearAll(): Promise<void> {
  await AsyncStorage.clear();
}
