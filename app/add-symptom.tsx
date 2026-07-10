import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
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
import { addEntry } from '@/memory/timeline';

type Step = 'camera' | 'loading' | 'review' | 'done';

type SymptomData = {
  appearance: string;
  description: string;
  advice: string;
};

const DEFAULT: SymptomData = {
  appearance: '',
  description: '',
  advice: '',
};

export default function AddSymptom() {
  const [permission, requestPermission] = useCameraPermissions();
  const [step, setStep] = useState<Step>('camera');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [symptom, setSymptom] = useState<SymptomData>(DEFAULT);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (!permission) requestPermission();
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
      const result = await analyzeImage(base64, mimeType, 'analyzeSymptom');

      setSymptom({
        appearance: (result.appearance as string) || '',
        description: (result.description as string) || '',
        advice: (result.advice as string) || '',
      });
      setStep('review');
    } catch {
      Alert.alert(
        'Could not analyze image',
        'Enter the details manually.',
        [{ text: 'OK' }]
      );
      setSymptom(DEFAULT);
      setStep('review');
    }
  };

  const confirmSymptom = async () => {
    const text = symptom.description || symptom.appearance || 'Symptom logged';
    await addEntry({
      date: new Date().toISOString(),
      type: 'symptom',
      event: text.slice(0, 200),
    });
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
        <Text style={styles.permissionText}>Camera access is needed to log symptoms.</Text>
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
            <Text style={styles.cameraHint}>Take a photo of the symptom</Text>
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
        <Text style={styles.loadingText}>Analyzing symptom…</Text>
      </View>
    );
  }

  if (step === 'done') {
    return (
      <View style={styles.centered}>
        <Text style={styles.doneIcon}>✓</Text>
        <Text style={styles.doneTitle}>Symptom Logged!</Text>
        <Text style={styles.doneSubtitle}>It has been saved to your health timeline.</Text>
        <Pressable style={styles.doneBtn} onPress={() => router.back()}>
          <Text style={styles.doneBtnText}>Back to Chat</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.formContainer}>
      {photoUri && <Image source={{ uri: photoUri }} style={styles.preview} />}

      <Text style={styles.label}>What do you see?</Text>
      <Text style={styles.value}>{symptom.appearance || 'Not detected'}</Text>

      <Text style={styles.label}>Description</Text>
      <Text style={styles.value}>{symptom.description || 'Not detected'}</Text>

      <Text style={styles.advice}>{symptom.advice}</Text>

      <View style={styles.actionRow}>
        <Pressable style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Discard</Text>
        </Pressable>
        <Pressable style={styles.confirmBtn} onPress={confirmSymptom}>
          <Text style={styles.confirmText}>Log Symptom</Text>
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
  label: { fontSize: 15, fontWeight: '600', color: '#334', marginBottom: 4, marginTop: 14 },
  value: { fontSize: 18, color: '#111', marginBottom: 4 },
  advice: { fontSize: 15, color: '#556', fontStyle: 'italic', marginTop: 16, lineHeight: 22 },
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
