import { cssInterop } from 'nativewind';
import { VideoView } from 'expo-video';
import { Image } from 'expo-image';

cssInterop(VideoView, { className: 'style' });
cssInterop(Image, { className: 'style' });