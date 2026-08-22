import { Stack } from 'expo-router';
import "../global.css";
import '../cssInterop';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTransparent: true,
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Choose File' }} />
      <Stack.Screen name="player" options={{ title: 'Play' }} />
    </Stack>
  );
}