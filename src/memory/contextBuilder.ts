import { loadProfile } from '@/lib/storage';
import { getRecentEntries } from './timeline';

export async function buildContext(): Promise<string> {
  const profile = await loadProfile();
  const timeline = await getRecentEntries(15);

  const parts: string[] = [];

  if (profile) {
    parts.push('USER PROFILE:');
    if (profile.name) parts.push(`- Name: ${profile.name}`);
    if (profile.age) parts.push(`- Age: ${profile.age}`);
    if (profile.conditions?.length) parts.push(`- Conditions: ${profile.conditions.join(', ')}`);
    if (profile.medications?.length) parts.push(`- Medications: ${profile.medications.join(', ')}`);
    if (profile.routine) parts.push(`- Routine: ${profile.routine}`);
  }

  if (timeline.length > 0) {
    parts.push('\nRECENT ACTIVITY (newest first):');
    for (const entry of timeline) {
      const date = entry.date.slice(0, 10);
      parts.push(`- [${date}] ${entry.event}`);
    }
  }

  return parts.join('\n');
}
