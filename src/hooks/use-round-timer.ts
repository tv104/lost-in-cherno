import { useState, useEffect } from 'react';

interface UseRoundTimerProps {
  initialTime: number;
  isActive: boolean;
  onTimeUp: () => void;
}

export function useRoundTimer({ initialTime, isActive, onTimeUp }: UseRoundTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (!isActive) return;

    let animationFrameId: number;
    const startTime = performance.now();
    const initialTimeLeft = timeLeft;
    let lastUpdateTime = startTime;

    const updateTimer = (currentTime: number) => {
      const safeCurrentTime = Math.max(currentTime, lastUpdateTime);
      const elapsedTime = (safeCurrentTime - startTime) / 1000;
      const newTimeLeft = Math.max(0, initialTimeLeft - elapsedTime);

      if (safeCurrentTime - lastUpdateTime >= 10 || newTimeLeft <= 0) {
        lastUpdateTime = safeCurrentTime;
        setTimeLeft(newTimeLeft);

        if (newTimeLeft <= 0) {
          onTimeUp();
          return;
        }
      }

      animationFrameId = requestAnimationFrame(updateTimer);
    };

    animationFrameId = requestAnimationFrame(updateTimer);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, timeLeft, onTimeUp]);

  const resetTimer = (newTime?: number) => {
    setTimeLeft(newTime ?? initialTime);
  };

  return { timeLeft, resetTimer };
}