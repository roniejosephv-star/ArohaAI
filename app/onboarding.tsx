import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { saveProfile, UserProfile } from '@/lib/storage';
import { addEntry } from '@/memory/timeline';

const COMMON_CONDITIONS = [
  'Diabetes', 'Blood Pressure', 'Thyroid', 'Arthritis',
  'Asthma', 'Cholesterol', 'Heart Disease', 'Other',
];

type Step = 'welcome' | 'name' | 'conditions' | 'medications' | 'routine' | 'done';

export default function Onboarding() {
  const [step, setStep] = useState<Step>('welcome');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [conditions, setConditions] = useState<string[]>([]);
  const [customCondition, setCustomCondition] = useState('');
  const [medications, setMedications] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [mealTimes, setMealTimes] = useState('');

  const toggleCondition = (c: string) => {
    if (c === 'Other') return;
    setConditions((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const finish = async () => {
    const allConditions = conditions;
    if (customCondition.trim()) {
      allConditions.push(customCondition.trim());
    }

    const routineParts: string[] = [];
    if (wakeTime.trim()) routineParts.push(`Wake: ${wakeTime.trim()}`);
    if (mealTimes.trim()) routineParts.push(`Meals: ${mealTimes.trim()}`);

    const profile: UserProfile = {
      name: name.trim() || undefined,
      age: age.trim() ? Number(age.trim()) : undefined,
      conditions: allConditions.length > 0 ? allConditions : undefined,
      medications: medications.trim() ? medications.trim().split(',').map((m) => m.trim()).filter(Boolean) : undefined,
      routine: routineParts.length > 0 ? routineParts.join('; ') : undefined,
    };

    await saveProfile(profile);

    await addEntry({
      date: new Date().toISOString(),
      type: 'onboarding',
      event: `User completed onboarding${profile.name ? ` as ${profile.name}` : ''}`,
    });

    setStep('done');
    setTimeout(() => router.replace('/(tabs)/chat'), 2000);
  };

  const next = () => {
    const order: Step[] = ['welcome', 'name', 'conditions', 'medications', 'routine', 'done'];
    const idx = order.indexOf(step);
    if (idx < order.length - 1) setStep(order[idx + 1]);
  };

  const back = () => {
    const order: Step[] = ['welcome', 'name', 'conditions', 'medications', 'routine', 'done'];
    const idx = order.indexOf(step);
    if (idx > 0) setStep(order[idx - 1]);
  };

  const skip = () => {
    const order: Step[] = ['welcome', 'name', 'conditions', 'medications', 'routine', 'done'];
    const idx = order.indexOf(step);
    if (idx < order.length - 1) setStep(order[idx + 1]);
  };

  const canProceedName = name.trim().length > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {step === 'welcome' && (
            <View style={styles.step}>
              <Text style={styles.logo}>🌿</Text>
              <Text style={styles.title}>Welcome to Aroha</Text>
              <Text style={styles.subtitle}>
                Your personal health companion.{'\n'}
                Let's get to know each other.
              </Text>
              <Pressable style={styles.primaryBtn} onPress={next}>
                <Text style={styles.primaryText}>Let's Start</Text>
              </Pressable>
            </View>
          )}

          {step === 'name' && (
            <View style={styles.step}>
              <Text style={styles.title}>What's your name?</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor="#889"
                autoFocus
              />
              <Text style={styles.label}>Age (optional)</Text>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                placeholder="Your age"
                placeholderTextColor="#889"
                keyboardType="number-pad"
              />
              <Pressable
                style={[styles.primaryBtn, !canProceedName && styles.btnDisabled]}
                onPress={canProceedName ? next : undefined}
              >
                <Text style={styles.primaryText}>Next</Text>
              </Pressable>
              <Pressable style={styles.skipBtn} onPress={skip}>
                <Text style={styles.skipText}>Skip for now</Text>
              </Pressable>
            </View>
          )}

          {step === 'conditions' && (
            <View style={styles.step}>
              <Text style={styles.title}>Any medical conditions?</Text>
              <Text style={styles.hint}>Tap all that apply</Text>
              <View style={styles.chipRow}>
                {COMMON_CONDITIONS.map((c) => (
                  <Pressable
                    key={c}
                    style={[styles.chip, conditions.includes(c) && styles.chipActive]}
                    onPress={() => toggleCondition(c)}
                  >
                    <Text style={[styles.chipText, conditions.includes(c) && styles.chipTextActive]}>
                      {c}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Text style={styles.label}>Other (optional)</Text>
              <TextInput
                style={styles.input}
                value={customCondition}
                onChangeText={setCustomCondition}
                placeholder="e.g. Kidney disease"
                placeholderTextColor="#889"
              />
              <Pressable style={styles.primaryBtn} onPress={next}>
                <Text style={styles.primaryText}>Next</Text>
              </Pressable>
              <Pressable style={styles.skipBtn} onPress={skip}>
                <Text style={styles.skipText}>Skip for now</Text>
              </Pressable>
            </View>
          )}

          {step === 'medications' && (
            <View style={styles.step}>
              <Text style={styles.title}>Current medications?</Text>
              <Text style={styles.hint}>Separate each medicine with a comma</Text>
              <TextInput
                style={[styles.input, styles.multiline]}
                value={medications}
                onChangeText={setMedications}
                placeholder="e.g. Metformin 500mg, Amlodipine 5mg"
                placeholderTextColor="#889"
                multiline
              />
              <Pressable style={styles.primaryBtn} onPress={next}>
                <Text style={styles.primaryText}>Next</Text>
              </Pressable>
              <Pressable style={styles.skipBtn} onPress={skip}>
                <Text style={styles.skipText}>Skip for now</Text>
              </Pressable>
            </View>
          )}

          {step === 'routine' && (
            <View style={styles.step}>
              <Text style={styles.title}>Daily routine</Text>
              <Text style={styles.hint}>What time do you usually…</Text>
              <Text style={styles.label}>Wake up?</Text>
              <TextInput
                style={styles.input}
                value={wakeTime}
                onChangeText={setWakeTime}
                placeholder="e.g. 7:00 AM"
                placeholderTextColor="#889"
              />
              <Text style={styles.label}>Have meals?</Text>
              <TextInput
                style={styles.input}
                value={mealTimes}
                onChangeText={setMealTimes}
                placeholder="e.g. Breakfast 9AM, Lunch 1PM, Dinner 8PM"
                placeholderTextColor="#889"
              />
              <Pressable style={styles.primaryBtn} onPress={finish}>
                <Text style={styles.primaryText}>Done</Text>
              </Pressable>
              <Pressable style={styles.skipBtn} onPress={finish}>
                <Text style={styles.skipText}>Skip for now</Text>
              </Pressable>
            </View>
          )}

          {step === 'done' && (
            <View style={styles.step}>
              <Text style={styles.doneIcon}>✓</Text>
              <Text style={styles.title}>All set{name ? `, ${name}` : ''}!</Text>
              <Text style={styles.subtitle}>
                Aroha knows about you now.{'\n'}
                Let's start your health journey.
              </Text>
            </View>
          )}
        </ScrollView>

        {step !== 'welcome' && step !== 'done' && (
          <View style={styles.bottomRow}>
            <Pressable style={styles.backBtn} onPress={back}>
              <Text style={styles.backText}>← Back</Text>
            </Pressable>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1 },
  container: { flexGrow: 1, justifyContent: 'center', padding: 28 },
  step: { alignItems: 'center', gap: 12 },
  logo: { fontSize: 64, marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '700', color: '#123', textAlign: 'center' },
  subtitle: { fontSize: 18, color: '#556', textAlign: 'center', lineHeight: 26, marginBottom: 8 },
  hint: { fontSize: 15, color: '#889', textAlign: 'center', marginBottom: 8 },
  label: { fontSize: 16, fontWeight: '600', color: '#334', alignSelf: 'flex-start', marginTop: 12, marginBottom: 4 },
  input: {
    width: '100%',
    fontSize: 20,
    borderWidth: 1.5,
    borderColor: '#cdd',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#111',
  },
  multiline: { minHeight: 90, textAlignVertical: 'top' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#cdd',
  },
  chipActive: { backgroundColor: '#0E7C7B', borderColor: '#0E7C7B' },
  chipText: { fontSize: 16, color: '#556' },
  chipTextActive: { color: '#fff' },
  primaryBtn: {
    width: '100%',
    backgroundColor: '#0E7C7B',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  btnDisabled: { opacity: 0.4 },
  primaryText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  skipBtn: { marginTop: 12, paddingVertical: 8 },
  skipText: { fontSize: 16, color: '#889' },
  doneIcon: { fontSize: 72, color: '#0E7C7B', marginBottom: 8 },
  bottomRow: { paddingHorizontal: 28, paddingBottom: 12 },
  backBtn: { paddingVertical: 12 },
  backText: { fontSize: 18, color: '#0E7C7B', fontWeight: '600' },
});
