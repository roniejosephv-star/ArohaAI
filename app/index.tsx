import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { loadProfile } from '@/lib/storage';

export default function Index() {
  const [ready, setReady] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    (async () => {
      const profile = await loadProfile();
      setHasProfile(profile !== null);
      setReady(true);
    })();
  }, []);

  if (!ready) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#0E7C7B" />
      </View>
    );
  }

  if (hasProfile) {
    return <Redirect href="/(tabs)/chat" />;
  }

  return <Redirect href="/onboarding" />;
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
});
