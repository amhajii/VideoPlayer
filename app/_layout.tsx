import { Stack } from 'expo-router';
import "../global.css";
import '../cssInterop';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#000',
        },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'انتخاب فایل' }} />
      <Stack.Screen name="player" options={{ title: 'پخش' }} />
    </Stack>
  );
}