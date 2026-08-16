import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-slate-100">
      <Text className="text-2xl font-bold text-3xl">به اپ ما خوش اومدی 👋</Text>
      <Pressable
        className="bg-green-600 px-10 py-5 rounded-2xl m-5 active:opacity-80 active:bg-red-400"
        onPress={() => router.push('/about')}
      >
        <Text className="text-white text-base font-semibold text-xl">برو به صفحه‌ی About</Text>
      </Pressable>
    </View>
  );
}