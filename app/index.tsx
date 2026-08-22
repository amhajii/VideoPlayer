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

    console.log('Picked file:', file);
    console.log('File URI:', file.uri);
    console.log('File Type:', type);

    router.push({
      pathname: './PlayerScreen',
      params: { uri: file.uri, type },
    });
  };

  return (
    <View className="flex-1 flex-col pt-40 items-center bg-[#111111]">
      
      <Text className="text-white text-5xl mb-2 "> Video Player </Text>
      <Text className="text-white text-base font-thin mb-6"> the custom and helpful video player for you. </Text>
      <Pressable
        onPress={pickFile}
        className="bg-neutral-800 px-7 py-4 rounded-2xl active:bg-neutral-700"
      >
        <Text className="text-white text-lg font-medium">Choose File</Text>
      </Pressable>
    </View>
  );
}