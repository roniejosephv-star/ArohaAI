import AsyncStorage from '@react-native-async-storage/async-storage';

export type Medication = {
  id: string;
  name: string;
  dosage: string;
  form: string;
  frequency: string;
  times: string[];
  instructions: string;
  isActive: boolean;
  createdAt: string;
};

export type ScheduleEvent = {
  id: string;
  date: string;
  time: string;
  title: string;
  type: 'medication' | 'meal' | 'exercise' | 'appointment' | 'custom';
  medId?: string;
  completed: boolean;
};

const MEDICATIONS_KEY = 'aroha:medications';
const EVENTS_KEY = 'aroha:events';

export async function saveMedication(med: Medication): Promise<void> {
  const all = await loadMedications();
  all.push(med);
  await AsyncStorage.setItem(MEDICATIONS_KEY, JSON.stringify(all));
}

export async function loadMedications(): Promise<Medication[]> {
  const raw = await AsyncStorage.getItem(MEDICATIONS_KEY);
  return raw ? (JSON.parse(raw) as Medication[]) : [];
}

export async function saveEvents(events: ScheduleEvent[]): Promise<void> {
  await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

export async function loadEvents(): Promise<ScheduleEvent[]> {
  const raw = await AsyncStorage.getItem(EVENTS_KEY);
  return raw ? (JSON.parse(raw) as ScheduleEvent[]) : [];
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
