import { useEffect } from "react";

type Props = {
  timeLeft: number;
  onTimeUpdate: (time: number) => void;
  onTimeUp: () => void;
  isPlaying: boolean;
};

export const RoundManager: React.FC<Props> = ({
  timeLeft,
  onTimeUpdate,
  onTimeUp,
  isPlaying,
}) => {
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (timeLeft > 0) {
        onTimeUpdate(Math.max(0, timeLeft - 0.01));
      } else {
        onTimeUp();
        clearInterval(interval);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [timeLeft, isPlaying, onTimeUpdate, onTimeUp]);

  return null;
};
