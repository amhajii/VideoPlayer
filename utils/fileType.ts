export type MediaType = 'video' | 'gif' | 'unknown';

const VIDEO_EXTENSIONS = ['mp4', 'mov', 'mkv', 'avi', 'webm', '3gp'];
const GIF_EXTENSIONS = ['gif'];

export function getMediaType(fileName?: string | null): MediaType {
  if (!fileName) return 'unknown';
  const ext = fileName.split('.').pop()?.toLowerCase();

  if (!ext) return 'unknown';
  if (GIF_EXTENSIONS.includes(ext)) return 'gif';
  if (VIDEO_EXTENSIONS.includes(ext)) return 'video';
  return 'unknown';
}