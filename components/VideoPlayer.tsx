import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Pressable, Text, Animated, useWindowDimensions } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';
import Slider from '@react-native-community/slider';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';

type Props = {
  uri: string;
  onFullscreenChange?: (isFullscreen: boolean) => void;
};

const DOUBLE_TAP_DELAY = 300;
const SEEK_SECONDS = 5;
const HIDE_CONTROLS_DELAY = 3000;

export default function VideoPlayer({ uri, onFullscreenChange }: Props) {
  const { width, height } = useWindowDimensions();

  const player = useVideoPlayer(uri, (player) => {
    // player.volume = 0;
    player.loop = true;
    player.timeUpdateEventInterval = 0.5;
    player.play();
  });

  const { isPlaying } = useEvent(
    player,
    'playingChange',
    useMemo(() => ({ isPlaying: player.playing }), [player])
  );

  const { currentTime } = useEvent(
    player,
    'timeUpdate',
    useMemo(
      () => ({
        currentTime: player.currentTime,
        currentLiveTimestamp: null,
        currentOffsetFromLive: null,
        bufferedPosition: player.bufferedPosition ?? 0,
      }),
      [player]
    )
  );

  const duration = player.duration;

  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const lastTapLeft = useRef(0);
  const lastTapRight = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const controlsTranslateY = useRef(new Animated.Value(0)).current;

  const showControls = () => {
    setControlsVisible(true);
    Animated.parallel([
      Animated.timing(controlsOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(controlsTranslateY, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
    resetHideTimer();
  };

  const hideControls = () => {
    Animated.parallel([
      Animated.timing(controlsOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
      Animated.timing(controlsTranslateY, { toValue: 40, duration: 250, useNativeDriver: true }),
    ]).start(() => setControlsVisible(false));
  };

  const resetHideTimer = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (isPlaying) hideControls();
    }, HIDE_CONTROLS_DELAY);
  };

  useEffect(() => {
    resetHideTimer();
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [isPlaying]);

  // پاک‌سازی هنگام خروج از کامپوننت
  useEffect(() => {
    NavigationBar.setVisibilityAsync('hidden');
    // NavigationBar.setBehaviorAsync('overlay-swipe');
    return () => {
      // ScreenOrientation.unlockAsync();
      // NavigationBar.setVisibilityAsync('visible');
    };
  }, []);

  // مدیریت navigation bar بر اساس حالت فول‌اسکرین (فقط اندروید تاثیر داره)
  useEffect(() => {
    if (isFullscreen) {
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setBehaviorAsync('overlay-swipe');
    } else {
      // NavigationBar.setVisibilityAsync('visible');
    }
  }, [isFullscreen]);

  const togglePlay = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
    showControls();
  };

  const seekBy = (seconds: number) => {
    const newTime = Math.min(Math.max(player.currentTime + seconds, 0), duration || 0);
    player.currentTime = newTime;
    showControls();
  };

  const handleLeftTap = () => {
    const now = Date.now();
    if (now - lastTapLeft.current < DOUBLE_TAP_DELAY) {
      seekBy(-SEEK_SECONDS);
      lastTapLeft.current = 0;
    } else {
      lastTapLeft.current = now;
      toggleControlsVisibility();
    }
  };

  const handleRightTap = () => {
    const now = Date.now();
    if (now - lastTapRight.current < DOUBLE_TAP_DELAY) {
      seekBy(SEEK_SECONDS);
      lastTapRight.current = 0;
    } else {
      lastTapRight.current = now;
      toggleControlsVisibility();
    }
  };

  const toggleControlsVisibility = () => {
    if (controlsVisible) {
      hideControls();
    } else {
      showControls();
    }
  };

  const toggleFullscreen = async () => {
    if (isFullscreen) {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      setIsFullscreen(false);
      onFullscreenChange?.(false);
    } else {
      await ScreenOrientation.unlockAsync();
      setIsFullscreen(true);
      onFullscreenChange?.(true);
    }
    showControls();
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <View
      className="bg-black justify-center"
      style={
        isFullscreen
          ? {
              position: 'absolute',
              top: 0,
              left: 0,
              width,
              height,
              zIndex: 100,
            }
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

      {/* لایه‌ی شفاف روی ویدیو برای تشخیص تپ‌ها */}
      <View className="absolute inset-0 flex-row">
        <Pressable onPress={handleLeftTap} className="flex-1" />
        <Pressable onPress={togglePlay} className="w-16" />
        <Pressable onPress={handleRightTap} className="flex-1" />
      </View>

      {/* کنترلر پایین صفحه */}
      <Animated.View
        pointerEvents={controlsVisible ? 'auto' : 'none'}
        style={{
          opacity: controlsOpacity,
          transform: [{ translateY: controlsTranslateY }],
        }}
        className="absolute bottom-0 left-0 right-0 bg-black/60 px-4 pt-2 pb-6"
      >
        <Slider
          value={isSeeking ? seekValue : currentTime}
          minimumValue={0}
          maximumValue={duration || 1}
          minimumTrackTintColor="#ffffff"
          maximumTrackTintColor="#555555"
          thumbTintColor="#ffffff"
          onValueChange={(value) => {
            setSeekValue(value);
            resetHideTimer();
          }}
          onSlidingStart={() => {
            setIsSeeking(true);
            resetHideTimer();
          }}
          onSlidingComplete={(value) => {
            player.currentTime = value;
            setIsSeeking(false);
            resetHideTimer();
          }}
        />

        <View className="flex-row justify-between items-center mt-1">
          <Text className="text-white text-xs">{formatTime(currentTime)}</Text>

          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={togglePlay}
              className="bg-neutral-800 px-5 py-2 rounded-full active:bg-neutral-700"
            >
              <Text className="text-white text-sm font-medium">
                {isPlaying ? 'توقف' : 'پخش'}
              </Text>
            </Pressable>

            <Pressable
              onPress={toggleFullscreen}
              className="bg-neutral-800 px-4 py-2 rounded-full active:bg-neutral-700"
            >
              <Text className="text-white text-sm font-medium">
                {isFullscreen ? '⤢' : '⛶'}
              </Text>
            </Pressable>
          </View>

          <Text className="text-white text-xs">{formatTime(duration)}</Text>
        </View>

        {/* دکمه‌ی بزرگ play/pause دستی، زیر ردیف کنترلر اصلی */}
        <View className="items-center mt-3">
          <Pressable
            onPress={togglePlay}
            className="bg-white/90 w-14 h-14 rounded-full items-center justify-center active:bg-white/70"
          >
            <Text className="text-black text-xl font-bold">
              {isPlaying ? '⏸' : '▶'}
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}