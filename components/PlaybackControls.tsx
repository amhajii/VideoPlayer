import React, { useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';

import { SEEK_SECONDS } from '@/Constants';
import { formatTime } from '../utils/formatTime';

type Props = {
  visible: boolean;
  opacity: Animated.Value;
  translateY: Animated.Value;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isFullscreen: boolean;
  onTogglePlay: () => void;
  onSeekBy: (seconds: number) => void;
  onSeekTo: (time: number) => void;
  onToggleFullscreen: () => void;
  onInteract: () => void;
};


export default function PlaybackControls({
  visible,
  opacity,
  translateY,
  isPlaying,
  currentTime,
  duration,
  isFullscreen,
  onTogglePlay,
  onSeekBy,
  onSeekTo,
  onToggleFullscreen,
  onInteract,
}: Props) {
  
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={{
        opacity,
        transform: [{ translateY }],
      }}
      className="absolute bottom-0 left-0 right-0 bg-black/70 px-4 pt-3 pb-5"
    >
      {/* Progress */}

      <Slider
        value={isSeeking ? seekValue : currentTime}
        minimumValue={0}
        maximumValue={duration || 1}
        minimumTrackTintColor="#ffffff"
        maximumTrackTintColor="rgba(255,255,255,0.3)"
        thumbTintColor="#ffffff"
        onValueChange={(value) => {
          setSeekValue(value);
          onInteract();
        }}
        onSlidingStart={() => {
          setIsSeeking(true);
          onInteract();
        }}
        onSlidingComplete={(value) => {
          onSeekTo(value);
          setIsSeeking(false);
          onInteract();
        }}
      />

      {/* Bottom Row */}

      <View className="flex-row items-center justify-between mt-1">
        <Text className="text-white text-xs font-medium">
          {formatTime(currentTime)}
        </Text>

        <View className="flex-row items-center">
          <Pressable
            onPress={() => onSeekBy(-SEEK_SECONDS)}
            className="w-10 h-10 items-center justify-center rounded-full active:bg-white/10"
          >
            <View className="items-center justify-center">
              <Ionicons name="play-back" size={19} color="white" />
              <Text className="absolute text-white text-[8px] font-bold">
                {SEEK_SECONDS}
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={onTogglePlay}
            className="w-11 h-11 mx-2 rounded-full bg-white items-center justify-center active:bg-white/80"
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={21}
              color="black"
              style={!isPlaying ? { marginLeft: 2 } : undefined}
            />
          </Pressable>

          <Pressable
            onPress={() => onSeekBy(SEEK_SECONDS)}
            className="w-10 h-10 items-center justify-center rounded-full active:bg-white/10"
          >
            <View className="items-center justify-center">
              <Ionicons name="play-forward" size={19} color="white" />
              <Text className="absolute text-white text-[8px] font-bold">
                {SEEK_SECONDS}
              </Text>
            </View>
          </Pressable>
        </View>

        <View className="flex-row items-center">
          <Text className="text-white/70 text-xs font-medium mr-3">
            {formatTime(duration)}
          </Text>

          <Pressable
            onPress={onToggleFullscreen}
            className="w-10 h-10 rounded-full items-center justify-center active:bg-white/10"
          >
            <Ionicons
              name={isFullscreen ? 'contract' : 'expand'}
              size={21}
              color="white"
            />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}
