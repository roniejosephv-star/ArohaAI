import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { generateDoctorSummary } from '@/lib/doctorSummary';

export default function DoctorSummary() {
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const result = await generateDoctorSummary();
        setSummary(result);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Could not generate summary.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Doctor-Visit Summary</Text>

        {loading && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#0E7C7B" />
            <Text style={styles.loadingText}>Preparing your summary…</Text>
          </View>
        )}

        {error && (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retryBtn} onPress={() => router.back()}>
              <Text style={styles.retryText}>Go Back</Text>
            </Pressable>
          </View>
        )}

        {summary && (
          <>
            <Text style={styles.summaryText}>{summary}</Text>
            <Pressable style={styles.doneBtn} onPress={() => router.back()}>
              <Text style={styles.doneBtnText}>Back to Chat</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '700', color: '#123', marginBottom: 16 },
  centered: { alignItems: 'center', paddingVertical: 40 },
  loadingText: { marginTop: 16, fontSize: 18, color: '#556' },
  errorText: { fontSize: 16, color: '#c33', textAlign: 'center', marginBottom: 16 },
  retryBtn: {
    backgroundColor: '#0E7C7B',
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  summaryText: { fontSize: 17, color: '#123', lineHeight: 26, marginBottom: 24 },
  doneBtn: {
    backgroundColor: '#0E7C7B',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  doneBtnText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
