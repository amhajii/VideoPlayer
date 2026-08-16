import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>به اپ ما خوش اومدی 👋</Text>
      <Text style={styles.title}>اولین پروژه React Native</Text>
      <Pressable style={styles.button} onPress={() => router.push('/about')}>
        <Text style={styles.buttonText}>برو به صفحه‌ی About</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#f0f0f0', flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  title: { fontSize: 22, fontWeight: 'bold' },
  button: { backgroundColor: '#4A90D9', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});