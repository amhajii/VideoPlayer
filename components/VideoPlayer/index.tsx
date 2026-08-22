import React, { useEffect } from 'react';
import { Pressable, View, useWindowDimensions } from 'react-native';
import { VideoView } from 'expo-video';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';

import { SEEK_SECONDS } from '@/Constants';
import PlayPauseIndicator from '../PlayPauseIndicator';
import PlaybackControls from '../PlaybackControls';

import {
  useVideoControls,
  useControlsVisibility,
  useDoubleTapSeek,
  useFullscreen,
} from '@/Hooks';



type Props = {
  uri: string;
  onFullscreenChange?: (isFullscreen: boolean) => void;
};

export default function VideoPlayer({ uri, onFullscreenChange }: Props) {

  const { width, height } = useWindowDimensions();
  const { player, isPlaying, currentTime, duration, togglePlay, seekBy, seekTo } = useVideoControls(uri);
  
  const {
    controlsVisible,
    controlsOpacity,
    controlsTranslateY,
    showControls,
    resetHideTimer,
  } = useControlsVisibility(isPlaying);

  const { isFullscreen, toggleFullscreen } = useFullscreen(onFullscreenChange);

  // Wrap the "bare" actions so every interaction also re-shows/resets the controls,
  // same as the original single-file behavior.
  const handleTogglePlay = () => {
    togglePlay();
    showControls();
  };

  const handleSeekBy = (seconds: number) => {
    seekBy(seconds);
    showControls();
  };

  const handleToggleFullscreen = () => {
    toggleFullscreen();
    showControls();
  };

  const { handleVideoTap } = useDoubleTapSeek({
    width,
    onSingleTap: handleTogglePlay,
    onSeekLeft: () => handleSeekBy(-SEEK_SECONDS),
    onSeekRight: () => handleSeekBy(SEEK_SECONDS),
  });

  useEffect(() => {
    NavigationBar.setVisibilityAsync('hidden');
  }, []);

  return (
    <View
      className="bg-black justify-center"
      style={
        isFullscreen
          ? { position: 'absolute', top: 0, left: 0, width, height, zIndex: 100 }
          : { flex: 1 }
      }
    >
      <StatusBar hidden={isFullscreen} />

      <VideoView
        player={player}
        className="flex-1"
        nativeControls={false}
        contentFit="contain"
      />

      <Pressable onPress={handleVideoTap} className="absolute inset-0" />

      <PlayPauseIndicator isPlaying={isPlaying} opacity={controlsOpacity} />

      <PlaybackControls
        visible={controlsVisible}
        opacity={controlsOpacity}
        translateY={controlsTranslateY}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        isFullscreen={isFullscreen}
        onTogglePlay={handleTogglePlay}
        onSeekBy={handleSeekBy}
        onSeekTo={seekTo}
        onToggleFullscreen={handleToggleFullscreen}
        onInteract={resetHideTimer}
      />
    </View>
  );
}
