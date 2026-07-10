import { loadProfile } from './storage';
import { loadEvents } from './schedule';
import { getRecentEntries } from '@/memory/timeline';

const API_URL = process.env.EXPO_PUBLIC_AROHA_API_URL;

export async function generateDoctorSummary(): Promise<string> {
  if (!API_URL) throw new Error('EXPO_PUBLIC_AROHA_API_URL is not set.');

  const profile = await loadProfile();
  const events = await loadEvents();
  const timeline = await getRecentEntries(30);

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const recentEvents = events.filter((e) => e.date >= sevenDaysAgo);
  const completed = recentEvents.filter((e) => e.completed).length;
  const total = recentEvents.length;
  const adherence = total > 0 ? `${completed} of ${total} events completed (${Math.round((completed / total) * 100)}%)` : 'No scheduled events in the last 7 days.';

  const symptoms = timeline
    .filter((e) => e.type === 'symptom')
    .slice(-10)
    .map((e) => `[${e.date.slice(0, 10)}] ${e.event}`);

  const recentActivity = timeline
    .slice(-15)
    .map((e) => `[${e.date.slice(0, 10)}] ${e.event}`);

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      intent: 'generateDoctorSummary',
      profile,
      adherence,
      symptoms,
      recentActivity,
    }),
  });

  if (!res.ok) throw new Error(`Summary request failed (${res.status}).`);

  const data = (await res.json()) as { summary?: string; error?: string };
  if (data.error || !data.summary) throw new Error(data.error || 'No summary returned.');
  return data.summary;
}
