import { Redirect } from 'expo-router';

// The real routing happens in _layout.tsx based on auth state.
// This just points the initial route somewhere valid.
export default function Index() {
  return <Redirect href="/(tabs)/chat" />;
}
