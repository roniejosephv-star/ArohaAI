import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="add-medication"
          options={{ presentation: 'modal', headerShown: true, title: 'Add Medication' }}
        />
        <Stack.Screen
          name="add-symptom"
          options={{ presentation: 'modal', headerShown: true, title: 'Log Symptom' }}
        />
        <Stack.Screen
          name="doctor-summary"
          options={{ presentation: 'modal', headerShown: true, title: 'Doctor Visit' }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
