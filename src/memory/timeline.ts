import { getDb } from './db';
import { TimelineEntry } from './types';

export async function addEntry(entry: Omit<TimelineEntry, 'id'>): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    'INSERT INTO timeline (date, type, event, metadata) VALUES (?, ?, ?, ?)',
    entry.date,
    entry.type,
    entry.event,
    entry.metadata || null
  );
}

export async function getRecentEntries(limit = 20): Promise<TimelineEntry[]> {
  const database = await getDb();
  const rows = await database.getAllAsync<TimelineEntry>(
    'SELECT * FROM timeline ORDER BY date DESC LIMIT ?',
    limit
  );
  return rows;
}

export async function getEntriesByDate(date: string): Promise<TimelineEntry[]> {
  const database = await getDb();
  const rows = await database.getAllAsync<TimelineEntry>(
    'SELECT * FROM timeline WHERE date = ? ORDER BY id ASC',
    date
  );
  return rows;
}
