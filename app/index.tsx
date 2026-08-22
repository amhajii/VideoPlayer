import React from 'react';
import { View, Pressable, Text } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { getMediaType } from '../utils/fileType';
import "../global.css";

export default function HomeScreen() {
  const router = useRouter();

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['video/*', 'image/gif'],
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const file = result.assets[0];
    const type = getMediaType(file.name);

    if (type === 'unknown') {
      alert('این فرمت پشتیبانی نمی‌شه');
      return;
    }

    router.push({
      pathname: './player',
      params: { uri: file.uri, type },
    });
  };

  return (
    <View className="flex-1 justify-center items-center bg-black">
      <Pressable
        onPress={pickFile}
        className="bg-neutral-800 px-6 py-3 rounded-xl active:bg-neutral-700"
      >
        <Text className="text-white text-base font-medium">انتخاب فایل</Text>
      </Pressable>
    </View>
  );
}