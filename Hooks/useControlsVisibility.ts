import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { HIDE_CONTROLS_DELAY } from '@/Constants';

export function useControlsVisibility(isPlaying: boolean) {
  const [controlsVisible, setControlsVisible] = useState(true);
  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const controlsTranslateY = useRef(new Animated.Value(0)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    };
  }, [isPlaying]);

  return {
    controlsVisible,
    controlsOpacity,
    controlsTranslateY,
    showControls,
    hideControls,
    resetHideTimer,
  };
}
