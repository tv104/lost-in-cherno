export const formatTime = (seconds: number): string => {
  const secs = Math.floor(seconds);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${secs.toString().padStart(2, "0")}.${Math.floor(ms/100)}`;
};
  