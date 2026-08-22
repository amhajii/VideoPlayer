import { useState } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';

export function useFullscreen(
  onFullscreenChange?: (isFullscreen: boolean) => void
) {
  
  const [isFullscreen, setIsFullscreen] = useState(false);

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
  };

  return { isFullscreen, toggleFullscreen };
}
