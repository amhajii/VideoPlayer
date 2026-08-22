import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View , Text } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';

import { VideoPlayer , GifPlayer } from '@/components';
import type { MediaType } from '../utils/fileType';


export default function PlayerScreen() {

  // we use useLocalSearchParams to get the uri and type from the route params
  // we can't use props because we are using expo-router and the params are passed via the route
  const { uri, type } = useLocalSearchParams<{ uri: string; type: MediaType }>();

  const navigation = useNavigation();
  const [isFullscreen, setIsFullscreen] = useState(false);


  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: !isFullscreen,
    });
  }, [isFullscreen, navigation]);

  useEffect(() => {
    // console.log('uri:', uri);
    // console.log('type:', type);
  }, []);


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