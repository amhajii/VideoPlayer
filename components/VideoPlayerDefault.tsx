import React from 'react';
import { useVideoPlayer, VideoView } from 'expo-video';

type Props = {
  uri: string;
};

export default function VideoPlayerDefault({ uri }: Props) {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <VideoView
      player={player}
      className=" h-40"
      nativeControls
      contentFit="contain"
    />
  );
}