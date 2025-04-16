import { Button } from "@/components/ui/button";

type Props = {
  showAnswer: boolean;
  currentRound: number;
  maxRounds: number;
  onClick: () => void;
  disabled?: boolean;
};

const getButtonText = (
  showAnswer: boolean,
  currentRound: number,
  maxRounds: number
): string => {
  if (showAnswer) {
    return currentRound >= maxRounds ? "Results" : "Next round";
  }
  return "Guess";
};

export const GuessMapButton: React.FC<Props> = ({
  showAnswer,
  currentRound,
  maxRounds,
  onClick,
  disabled,
}) => (
  <Button
    variant="default"
    className="absolute bottom-0 right-0 left-0"
    onClick={onClick}
    disabled={disabled}
  >
    {getButtonText(showAnswer, currentRound, maxRounds)}
  </Button>
);
