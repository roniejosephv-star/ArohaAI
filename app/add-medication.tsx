import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { analyzeImage } from '@/lib/aroha';
import { saveMedication, saveEvents, generateId } from '@/lib/schedule';

type Step = 'camera' | 'loading' | 'review' | 'done';

type ExtractedData = {
  name: string;
  dosage: string;
  form: string;
  frequency: string;
  times: string[];
  instructions: string;
};

const FREQUENCIES = ['once_daily', 'twice_daily', 'thrice_daily', 'weekly', 'as_needed'];

const DEFAULT_MED: ExtractedData = {
  name: '',
  dosage: '',
  form: 'tablet',
  frequency: 'once_daily',
  times: ['08:00'],
  instructions: '',
};

export default function AddMedication() {
  const [permission, requestPermission] = useCameraPermissions();
  const [step, setStep] = useState<Step>('camera');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [med, setMed] = useState<ExtractedData>(DEFAULT_MED);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo?.uri) {
        setPhotoUri(photo.uri);
        setStep('loading');
        await analyzePhoto(photo.uri);
      }
    } catch {
      Alert.alert('Camera error', 'Could not take photo. Try again.');
      setStep('camera');
    }
  };

  const analyzePhoto = async (uri: string) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const mimeType = uri.endsWith('.png') ? 'image/png' : 'image/jpeg';
      const result = await analyzeImage(base64, mimeType, 'analyzeMedication');

      setMed({
        name: (result.name as string) || '',
        dosage: (result.dosage as string) || '',
        form: (result.form as string) || 'tablet',
        frequency: (result.frequency as string) || 'once_daily',
        times: Array.isArray(result.times) && result.times.length > 0
          ? (result.times as string[])
          : ['08:00'],
        instructions: (result.instructions as string) || '',
      });
      setStep('review');
    } catch {
      Alert.alert(
        'Could not read medication',
        'Fill in the details manually.',
        [{ text: 'OK' }]
      );
      setMed(DEFAULT_MED);
      setStep('review');
    }
  };

  const confirmMedication = async () => {
    if (!med.name.trim()) {
      Alert.alert('Missing name', 'Please enter the medication name.');
      return;
    }

    const medId = generateId();
    await saveMedication({
      id: medId,
      name: med.name.trim(),
      dosage: med.dosage,
      form: med.form,
      frequency: med.frequency,
      times: med.times,
      instructions: med.instructions,
      isActive: true,
      createdAt: new Date().toISOString(),
    });

    const today = new Date().toISOString().slice(0, 10);
    const events = med.times.map((time) => ({
      id: generateId(),
      date: today,
      time,
      title: `${med.name}${med.dosage ? ` (${med.dosage})` : ''}`,
      type: 'medication' as const,
      medId,
      completed: false,
    }));
    await saveEvents(events);

    setStep('done');
  };

  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#0E7C7B" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>Camera access is needed to photograph medications.</Text>
        <Pressable style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>Grant Permission</Text>
        </Pressable>
        <Pressable style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      </View>
    );
  }

  if (step === 'camera') {
    return (
      <View style={styles.flex}>
        <CameraView ref={cameraRef} style={styles.camera} facing="back">
          <View style={styles.cameraOverlay}>
            <Text style={styles.cameraHint}>Center the pill strip in the frame</Text>
            <Pressable style={styles.captureBtn} onPress={takePhoto}>
              <View style={styles.captureInner} />
            </Pressable>
          </View>
        </CameraView>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>Cancel</Text>
        </Pressable>
      </View>
    );
  }

  if (step === 'loading') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0E7C7B" />
        <Text style={styles.loadingText}>Reading medication…</Text>
      </View>
    );
  }

  if (step === 'done') {
    return (
      <View style={styles.centered}>
        <Text style={styles.doneIcon}>✓</Text>
        <Text style={styles.doneTitle}>Medication Added!</Text>
        <Text style={styles.doneSubtitle}>{med.name} has been added to your schedule.</Text>
        <Pressable
          style={styles.doneBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.doneBtnText}>Back to Chat</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.formContainer}>
      {photoUri && (
        <Image source={{ uri: photoUri }} style={styles.preview} />
      )}

      <Text style={styles.label}>Medication Name</Text>
      <TextInput
        style={styles.input}
        value={med.name}
        onChangeText={(v) => setMed({ ...med, name: v })}
        placeholder="e.g. Metformin"
      />

      <Text style={styles.label}>Dosage</Text>
      <TextInput
        style={styles.input}
        value={med.dosage}
        onChangeText={(v) => setMed({ ...med, dosage: v })}
        placeholder="e.g. 500mg"
      />

      <Text style={styles.label}>Frequency</Text>
      <View style={styles.freqRow}>
        {FREQUENCIES.map((f) => (
          <Pressable
            key={f}
            style={[styles.freqChip, med.frequency === f && styles.freqChipActive]}
            onPress={() => setMed({ ...med, frequency: f })}
          >
            <Text style={[styles.freqText, med.frequency === f && styles.freqTextActive]}>
              {f.replace(/_/g, ' ')}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Times (comma-separated, 24h)</Text>
      <TextInput
        style={styles.input}
        value={med.times.join(', ')}
        onChangeText={(v) =>
          setMed({ ...med, times: v.split(',').map((t) => t.trim()).filter(Boolean) })
        }
        placeholder="e.g. 08:00, 20:00"
      />

      <Text style={styles.label}>Instructions</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={med.instructions}
        onChangeText={(v) => setMed({ ...med, instructions: v })}
        placeholder="e.g. Take after meals"
        multiline
      />

      <View style={styles.actionRow}>
        <Pressable style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Pressable style={styles.confirmBtn} onPress={confirmMedication}>
          <Text style={styles.confirmText}>Confirm & Add</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 24 },
  camera: { flex: 1 },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 60,
  },
  cameraHint: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 30,
    overflow: 'hidden',
  },
  captureBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#fff',
  },
  backBtn: { position: 'absolute', top: 50, left: 20 },
  backText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  loadingText: { marginTop: 16, fontSize: 18, color: '#556' },
  doneIcon: { fontSize: 64, color: '#0E7C7B', marginBottom: 12 },
  doneTitle: { fontSize: 24, fontWeight: '700', color: '#123', marginBottom: 8 },
  doneSubtitle: { fontSize: 16, color: '#556', textAlign: 'center', marginBottom: 24 },
  doneBtn: {
    backgroundColor: '#0E7C7B',
    borderRadius: 14,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  doneBtnText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  permissionText: { fontSize: 18, textAlign: 'center', marginBottom: 20, color: '#556' },
  permissionBtn: {
    backgroundColor: '#0E7C7B',
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginBottom: 12,
  },
  permissionBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  preview: { width: '100%', height: 200, borderRadius: 12, marginBottom: 16 },
  formContainer: { padding: 20, paddingBottom: 40 },
  label: { fontSize: 15, fontWeight: '600', color: '#334', marginBottom: 6, marginTop: 14 },
  input: {
    fontSize: 18,
    borderWidth: 1.5,
    borderColor: '#cdd',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#111',
  },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  freqRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  freqChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#cdd',
  },
  freqChipActive: { backgroundColor: '#0E7C7B', borderColor: '#0E7C7B' },
  freqText: { fontSize: 14, color: '#556' },
  freqTextActive: { color: '#fff' },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 24 },
  cancelBtn: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#cdd',
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelText: { fontSize: 16, color: '#556', fontWeight: '600' },
  confirmBtn: {
    flex: 2,
    backgroundColor: '#0E7C7B',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
