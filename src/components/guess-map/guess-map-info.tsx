import { cn, formatTime } from "@/utils";
import { useMemo } from "react";

type GuessMapInfoProps = {
  currentRound: number;
  timeLeft: number;
  showAnswer: boolean;
  maxRounds: number;
};

const infoStyles =
  "absolute top-[calc(var(--button-height)*-1)] right-0 left-0 h-[var(--button-height)] flex justify-between items-end text-shadow-overlay";
const timeLeftStyles = "font-mono tabular-nums text-lg";

export const GuessMapInfo: React.FC<GuessMapInfoProps> = ({
  currentRound,
  timeLeft,
  showAnswer,
  maxRounds,
}) => {
  const timeStyles: string = useMemo(() => {
    if (showAnswer) return timeLeftStyles;

    return cn(timeLeftStyles, {
      "animation-pulse-color": timeLeft <= 10 && timeLeft > 5,
      "animation-pulse-color-fast": timeLeft <= 5,
    });
  }, [timeLeft, showAnswer]);

  return (
    <div className={infoStyles}>
      <span>
        Round {currentRound}/{maxRounds}
      </span>
      <span>
        Time left: <span className={timeStyles}>{formatTime(timeLeft)}s</span>
      </span>
    </div>
  );
};
