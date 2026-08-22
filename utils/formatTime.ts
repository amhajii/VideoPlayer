export function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) {
    return '0:00';
  }

  const minutes = Math.floor(seconds / 60);
  const secondsPart = Math.floor(seconds % 60);

  return `${minutes}:${secondsPart.toString().padStart(2, '0')}`;
}
