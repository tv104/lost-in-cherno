import { useEffect, useCallback } from "react";

type TimeManagerConfig = {
  isPlaying: boolean;
  timeLeft: number;
  onTimeUpdate: (time: number) => void;
  onTimeEnd?: () => void;
};

export const useTimeManager = ({
  isPlaying,
  timeLeft,
  onTimeUpdate,
  onTimeEnd,
}: TimeManagerConfig) => {
  const handleTimeUpdate = useCallback(
    (newTime: number) => {
      onTimeUpdate(newTime);
      if (newTime === 0 && onTimeEnd) {
        onTimeEnd();
      }
    },
    [onTimeUpdate, onTimeEnd]
  );

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (timeLeft > 0) {
        handleTimeUpdate(Math.max(0, timeLeft - 0.01));
      } else {
        clearInterval(interval);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [timeLeft, isPlaying, handleTimeUpdate]);
};