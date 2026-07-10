import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#0E7C7B',
        tabBarLabelStyle: { fontSize: 14 },
      }}
    >
      <Tabs.Screen
        name="chat"
        options={{ title: 'Aroha', tabBarLabel: 'Chat' }}
      />
      <Tabs.Screen
        name="schedule"
        options={{ title: 'Schedule', tabBarLabel: 'Schedule' }}
      />
    </Tabs>
  );
}
