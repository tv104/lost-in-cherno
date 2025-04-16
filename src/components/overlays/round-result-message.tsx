import { getResultMessage } from "../../utils";
import { useMemo } from "react";
import { useGameState } from "../../hooks";

export const RoundResultMessage: React.FC = () => {
  const { state } = useGameState();

  const { guessLocation, gameLocations, currentRound } = state;

  const showAnswer = useMemo(() => {
    return (
      state.phase === "game" &&
      !state.roundActive &&
      !state.isTransitioningRound
    );
  }, [state.phase, state.roundActive, state.isTransitioningRound]);

  const roundLocation = gameLocations[currentRound - 1].location;

  const message = useMemo(
    () => getResultMessage(guessLocation, roundLocation),
    [guessLocation, roundLocation]
  );

  if (!showAnswer) {
    return null;
  }

  return (
    <h1
      className={
        "absolute top-0 left-0 right-0 bottom-0 z-[var(--z-overlay)] flex justify-center items-center text-shadow-[var(--drop-shadow-overlay)] text-uppercase pointer-events-none"
      }
    >
      {message}
    </h1>
  );
};
