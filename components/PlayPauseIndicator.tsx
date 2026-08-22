import React from 'react';
import { Animated, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  isPlaying: boolean;
  opacity: Animated.Value;
};

export default function PlayPauseIndicator({ isPlaying, opacity }: Props) {
  return (
    <Animated.View
      pointerEvents="none"
      style={{ opacity }}
      className="absolute inset-0 items-center justify-center"
    >
      <View className="w-16 h-16 rounded-full bg-black/50 items-center justify-center">
        <Ionicons
          name={isPlaying ? 'pause' : 'play'}
          size={30}
          color="white"
          style={!isPlaying ? { marginLeft: 3 } : undefined}
        />
      </View>
    </Animated.View>
  );
}
