import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { loadEvents, saveEvents, ScheduleEvent } from '@/lib/schedule';
import { addEntry } from '@/memory/timeline';

export default function Schedule() {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [ready, setReady] = useState(false);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const all = await loadEvents();
        const today = new Date().toISOString().slice(0, 10);
        setEvents(all.filter((e) => e.date === today));
        setReady(true);
      })();
    }, [])
  );

  const toggleComplete = async (id: string) => {
    const updated = events.map((e) => {
      if (e.id === id) {
        const now = e.completed ? false : true;
        if (now) {
          addEntry({
            date: new Date().toISOString(),
            type: 'dose_completed',
            event: `Completed: ${e.title}`,
          });
        }
        return { ...e, completed: now };
      }
      return e;
    });
    setEvents(updated);

    const all = await loadEvents();
    const merged = all.map((e) => {
      const upd = updated.find((u) => u.id === e.id);
      return upd || e;
    });
    await saveEvents(merged);
  };

  if (!ready) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.centered}>
          <ActivityIndicator color="#0E7C7B" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.container}>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </Text>

        <Text style={styles.progress}>
          {events.filter((e) => e.completed).length} of {events.length} completed
        </Text>

        {events.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No events scheduled for today.</Text>
            <Text style={styles.emptyHint}>Add medications from the Chat screen.</Text>
          </View>
        ) : (
          <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <Pressable
                style={[styles.event, item.completed && styles.eventDone]}
                onPress={() => toggleComplete(item.id)}
              >
                <View style={styles.eventLeft}>
                  <Text style={styles.eventTime}>{item.time}</Text>
                  <View
                    style={[
                      styles.checkbox,
                      item.completed && styles.checkboxDone,
                    ]}
                  >
                    {item.completed && <Text style={styles.checkMark}>✓</Text>}
                  </View>
                </View>
                <View style={styles.eventRight}>
                  <Text
                    style={[
                      styles.eventTitle,
                      item.completed && styles.eventTitleDone,
                    ]}
                  >
                    {item.title}
                  </Text>
                  {item.type === 'medication' && (
                    <Text style={styles.eventType}>Medication</Text>
                  )}
                </View>
              </Pressable>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, padding: 16 },
  date: { fontSize: 20, fontWeight: '700', color: '#123', marginBottom: 4 },
  progress: { fontSize: 15, color: '#556', marginBottom: 16 },
  list: { gap: 10 },
  event: {
    flexDirection: 'row',
    borderRadius: 14,
    backgroundColor: '#F5F9F9',
    padding: 14,
    gap: 12,
  },
  eventDone: { opacity: 0.6 },
  eventLeft: { alignItems: 'center', gap: 6 },
  eventTime: { fontSize: 15, fontWeight: '600', color: '#0E7C7B' },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#0E7C7B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxDone: { backgroundColor: '#0E7C7B' },
  checkMark: { color: '#fff', fontSize: 16, fontWeight: '700' },
  eventRight: { flex: 1, justifyContent: 'center' },
  eventTitle: { fontSize: 17, fontWeight: '600', color: '#123' },
  eventTitleDone: { textDecorationLine: 'line-through', color: '#889' },
  eventType: { fontSize: 13, color: '#889', marginTop: 2 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#556' },
  emptyHint: { fontSize: 15, color: '#889', marginTop: 6 },
});
