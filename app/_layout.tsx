import { Stack } from 'expo-router';
import "../global.css";
import '../cssInterop';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'انتخاب فایل' }} />
      <Stack.Screen name="player" options={{ title: 'پخش' }} />
    </Stack>
  );
}