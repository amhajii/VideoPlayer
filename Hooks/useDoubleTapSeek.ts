import { useEffect, useRef } from 'react';
import { DOUBLE_TAP_DELAY } from '@/Constants';

type Options = {
  width: number;
  onSingleTap: () => void;
  onSeekLeft: () => void;
  onSeekRight: () => void;
};

export function useDoubleTapSeek({
  width,
  onSingleTap,
  onSeekLeft,
  onSeekRight,
}: Options) {
  
  const lastTap = useRef(0);
  const lastTapX = useRef(0);
  const singleTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleVideoTap = (event: any) => {
    const now = Date.now();
    const tapX = event.nativeEvent.locationX;
    const isDoubleTap = now - lastTap.current < DOUBLE_TAP_DELAY;

    if (isDoubleTap) {
      if (singleTapTimer.current) {
        clearTimeout(singleTapTimer.current);
        singleTapTimer.current = null;
      }

      const isLeftSide = lastTapX.current < width / 2;

      if (isLeftSide) {
        onSeekLeft();
      } else {
        onSeekRight();
      }

      lastTap.current = 0;
      lastTapX.current = 0;

      return;
    }

    lastTap.current = now;
    lastTapX.current = tapX;

    singleTapTimer.current = setTimeout(() => {
      onSingleTap();

      lastTap.current = 0;
      lastTapX.current = 0;
      singleTapTimer.current = null;
    }, DOUBLE_TAP_DELAY);
  };

  useEffect(() => {
    return () => {
      if (singleTapTimer.current) {
        clearTimeout(singleTapTimer.current);
      }
    };
  }, []);

  return { handleVideoTap };
}
