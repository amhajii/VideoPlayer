import { useMemo } from 'react';
import { useVideoPlayer } from 'expo-video';
import { useEvent } from 'expo';

export function useVideoControls(uri: string) {
  
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
    player.timeUpdateEventInterval = 0.5;
    player.play();
  });

  const duration = player.duration;

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
        bufferedPosition: player.bufferedPosition ?? 0,
      }),
      [player]
    )
  );

  const togglePlay = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  const seekBy = (seconds: number) => {
    const newTime = Math.min( Math.max(player.currentTime + seconds, 0), duration || 0 );
    player.currentTime = newTime;
  };

  const seekTo = (time: number) => {
    player.currentTime = time;
  };

  return {
    player,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    seekBy,
    seekTo,
  };
}
