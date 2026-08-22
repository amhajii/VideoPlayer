import React from 'react';
import { Image } from 'expo-image';

type Props = {
  uri: string;
};

export default function GifPlayer({ uri }: Props) {
  return (
    <Image
      source={{ uri }}
      className="flex-1"
      contentFit="contain"
      autoplay
    />
  );
}