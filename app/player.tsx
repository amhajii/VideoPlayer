import React, { useState, useLayoutEffect } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import VideoPlayer from '../components/VideoPlayer';
import GifPlayer from '../components/GifPlayer';
import type { MediaType } from '../utils/fileType';

export default function PlayerScreen() {
  const { uri, type } = useLocalSearchParams<{ uri: string; type: MediaType }>();
  const navigation = useNavigation();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: !isFullscreen,
    });
  }, [isFullscreen, navigation]);

  return (
    <View className="flex-1 bg-black">
      {type === 'video' ? (
        <VideoPlayer uri={uri} onFullscreenChange={setIsFullscreen} />
      ) : (
        <GifPlayer uri={uri} />
      )}
    </View>
  );
}