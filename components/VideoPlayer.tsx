import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
} from 'react';

import {
  View,
  Pressable,
  Text,
  Animated,
  useWindowDimensions,
} from 'react-native';

import {
  useVideoPlayer,
  VideoView,
} from 'expo-video';

import { useEvent } from 'expo';

import Slider from '@react-native-community/slider';

import * as ScreenOrientation from 'expo-screen-orientation';
import * as NavigationBar from 'expo-navigation-bar';

import { StatusBar } from 'expo-status-bar';

import { Ionicons } from '@expo/vector-icons';

type Props = {
  uri: string;
  onFullscreenChange?: (isFullscreen: boolean) => void;
};

const DOUBLE_TAP_DELAY = 300;
const SEEK_SECONDS = 5;
const HIDE_CONTROLS_DELAY = 3000;

export default function VideoPlayer({
  uri,
  onFullscreenChange,
}: Props) {
  const { width, height } = useWindowDimensions();

  // --------------------------------------------------
  // Video Player
  // --------------------------------------------------

  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
    player.timeUpdateEventInterval = 0.5;
    player.play();
  });

  // --------------------------------------------------
  // Events
  // --------------------------------------------------

  const { isPlaying } = useEvent(
    player,
    'playingChange',
    useMemo(
      () => ({
        isPlaying: player.playing,
      }),
      [player]
    )
  );

  const { currentTime } = useEvent(
    player,
    'timeUpdate',
    useMemo(
      () => ({
        currentTime: player.currentTime,
        currentLiveTimestamp: null,
        currentOffsetFromLive: null,
        bufferedPosition:
          player.bufferedPosition ?? 0,
      }),
      [player]
    )
  );

  const duration = player.duration;

  // --------------------------------------------------
  // State
  // --------------------------------------------------

  const [isSeeking, setIsSeeking] =
    useState(false);

  const [seekValue, setSeekValue] =
    useState(0);

  const [controlsVisible, setControlsVisible] =
    useState(true);

  const [isFullscreen, setIsFullscreen] =
    useState(false);

  // --------------------------------------------------
  // Refs
  // --------------------------------------------------

  const lastTap = useRef(0);

  const lastTapX = useRef(0);

  const singleTapTimer =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  const hideTimer =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  const controlsOpacity =
    useRef(new Animated.Value(1)).current;

  const controlsTranslateY =
    useRef(new Animated.Value(0)).current;

  // --------------------------------------------------
  // Controls
  // --------------------------------------------------

  const showControls = () => {
    setControlsVisible(true);

    Animated.parallel([
      Animated.timing(controlsOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),

      Animated.timing(controlsTranslateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    resetHideTimer();
  };

  const hideControls = () => {
    Animated.parallel([
      Animated.timing(controlsOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),

      Animated.timing(controlsTranslateY, {
        toValue: 40,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setControlsVisible(false);
    });
  };

  const resetHideTimer = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
    }

    hideTimer.current = setTimeout(() => {
      if (isPlaying) {
        hideControls();
      }
    }, HIDE_CONTROLS_DELAY);
  };

  useEffect(() => {
    resetHideTimer();

    return () => {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }

      if (singleTapTimer.current) {
        clearTimeout(singleTapTimer.current);
      }
    };
  }, [isPlaying]);

  // --------------------------------------------------
  // Navigation Bar
  // --------------------------------------------------

  useEffect(() => {
    NavigationBar.setVisibilityAsync('hidden');

    return () => {
      // ScreenOrientation.unlockAsync();
      // NavigationBar.setVisibilityAsync('visible');
    };
  }, []);

  // useEffect(() => {
  //   if (isFullscreen) {
  //     NavigationBar.setVisibilityAsync('hidden');
  //   }
  // }, [isFullscreen]);

  // --------------------------------------------------
  // Play / Pause
  // --------------------------------------------------

  const togglePlay = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }

    showControls();
  };

  // --------------------------------------------------
  // Seek
  // --------------------------------------------------

  const seekBy = (seconds: number) => {
    const newTime = Math.min(
      Math.max(
        player.currentTime + seconds,
        0
      ),
      duration || 0
    );

    player.currentTime = newTime;

    showControls();
  };

  // --------------------------------------------------
  // Video Tap Handler
  //
  // Single Tap:
  //      Play / Pause
  //
  // Double Tap:
  //      Left  -> -5s
  //      Right -> +5s
  // --------------------------------------------------

  const handleVideoTap = (
    event: any
  ) => {
    const now = Date.now();

    const tapX =
      event.nativeEvent.locationX;

    const videoWidth = width;

    const isDoubleTap =
      now - lastTap.current <
      DOUBLE_TAP_DELAY;

    if (isDoubleTap) {
      // Cancel pending single tap
      if (singleTapTimer.current) {
        clearTimeout(
          singleTapTimer.current
        );

        singleTapTimer.current = null;
      }

      // Determine left / right side
      const isLeftSide =
        lastTapX.current <
        videoWidth / 2;

      if (isLeftSide) {
        seekBy(-SEEK_SECONDS);
      } else {
        seekBy(SEEK_SECONDS);
      }

      lastTap.current = 0;
      lastTapX.current = 0;

      return;
    }

    // First tap
    lastTap.current = now;
    lastTapX.current = tapX;

    // Wait to see if second tap happens
    singleTapTimer.current = setTimeout(() => {
      togglePlay();

      lastTap.current = 0;
      lastTapX.current = 0;
      singleTapTimer.current = null;
    }, DOUBLE_TAP_DELAY);
  };

  // --------------------------------------------------
  // Fullscreen
  // --------------------------------------------------

  const toggleFullscreen = async () => {
    if (isFullscreen) {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );

      setIsFullscreen(false);

      onFullscreenChange?.(false);
    } else {
      await ScreenOrientation.unlockAsync();

      setIsFullscreen(true);

      onFullscreenChange?.(true);
    }

    showControls();
  };

  // --------------------------------------------------
  // Format Time
  // --------------------------------------------------

  const formatTime = (
    seconds: number
  ) => {
    if (!seconds || isNaN(seconds)) {
      return '0:00';
    }

    const minutes = Math.floor(
      seconds / 60
    );

    const secondsPart = Math.floor(
      seconds % 60
    );

    return `${minutes}:${secondsPart
      .toString()
      .padStart(2, '0')}`;
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

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
          : {
              flex: 1,
            }
      }
    >
      {/* Status Bar */}

      <StatusBar
        hidden={isFullscreen}
      />

      {/* -------------------------------------------- */}
      {/* Video */}
      {/* -------------------------------------------- */}

      <VideoView
        player={player}
        className="flex-1"
        nativeControls={false}
        contentFit="contain"
      />

      {/* -------------------------------------------- */}
      {/* Video Gesture Layer */}
      {/* -------------------------------------------- */}

      <Pressable
        onPress={handleVideoTap}
        className="absolute inset-0"
      />

      {/* -------------------------------------------- */}
      {/* Center Play / Pause Indicator */}
      {/* -------------------------------------------- */}

      <Animated.View
        pointerEvents="none"
        style={{
          opacity: controlsOpacity,
        }}
        className="absolute inset-0 items-center justify-center"
      >
        <View
          className="
            w-16
            h-16
            rounded-full
            bg-black/50
            items-center
            justify-center
          "
        >
          <Ionicons
            name={
              isPlaying
                ? 'pause'
                : 'play'
            }
            size={30}
            color="white"
            style={
              !isPlaying
                ? { marginLeft: 3 }
                : undefined
            }
          />
        </View>
      </Animated.View>

      {/* -------------------------------------------- */}
      {/* Bottom Controls */}
      {/* -------------------------------------------- */}

      <Animated.View
        pointerEvents={
          controlsVisible
            ? 'auto'
            : 'none'
        }
        style={{
          opacity: controlsOpacity,

          transform: [
            {
              translateY:
                controlsTranslateY,
            },
          ],
        }}
        className="
          absolute
          bottom-0
          left-0
          right-0
          bg-black/70
          px-4
          pt-3
          pb-5
        "
      >
        {/* Progress */}

        <Slider
          value={
            isSeeking
              ? seekValue
              : currentTime
          }
          minimumValue={0}
          maximumValue={
            duration || 1
          }
          minimumTrackTintColor="#ffffff"
          maximumTrackTintColor="rgba(255,255,255,0.3)"
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

        {/* ---------------------------------------- */}
        {/* Bottom Row */}
        {/* ---------------------------------------- */}

        <View className="flex-row items-center justify-between mt-1">
          {/* Current Time */}

          <Text className="text-white text-xs font-medium">
            {formatTime(currentTime)}
          </Text>

          {/* Main Controls */}

          <View className="flex-row items-center">
            {/* Rewind */}

            <Pressable
              onPress={() =>
                seekBy(-SEEK_SECONDS)
              }
              className="
                w-10
                h-10
                items-center
                justify-center
                rounded-full
                active:bg-white/10
              "
            >
              <View className="items-center justify-center">
                <Ionicons
                  name="play-back"
                  size={19}
                  color="white"
                />

                <Text className="absolute text-white text-[8px] font-bold">
                  5
                </Text>
              </View>
            </Pressable>

            {/* Play / Pause */}

            <Pressable
              onPress={togglePlay}
              className="
                w-11
                h-11
                mx-2
                rounded-full
                bg-white
                items-center
                justify-center
                active:bg-white/80
              "
            >
              <Ionicons
                name={
                  isPlaying
                    ? 'pause'
                    : 'play'
                }
                size={21}
                color="black"
                style={
                  !isPlaying
                    ? { marginLeft: 2 }
                    : undefined
                }
              />
            </Pressable>

            {/* Forward */}

            <Pressable
              onPress={() =>
                seekBy(SEEK_SECONDS)
              }
              className="
                w-10
                h-10
                items-center
                justify-center
                rounded-full
                active:bg-white/10
              "
            >
              <View className="items-center justify-center">
                <Ionicons
                  name="play-forward"
                  size={19}
                  color="white"
                />

                <Text className="absolute text-white text-[8px] font-bold">
                  5
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Right Side */}

          <View className="flex-row items-center">
            {/* Duration */}

            <Text className="text-white/70 text-xs font-medium mr-3">
              {formatTime(duration)}
            </Text>

            {/* Fullscreen */}

            <Pressable
              onPress={
                toggleFullscreen
              }
              className="
                w-10
                h-10
                rounded-full
                items-center
                justify-center
                active:bg-white/10
              "
            >
              <Ionicons
                name={
                  isFullscreen
                    ? 'contract'
                    : 'expand'
                }
                size={21}
                color="white"
              />
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}