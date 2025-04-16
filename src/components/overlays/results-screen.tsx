import { Overlay } from "./overlay";
import {
  calculateTotalScore,
  formatGameResults,
  getScoreHeadingMessage,
} from "@/utils";
import { useState, useMemo } from "react";
import { useGameState } from "@/hooks";
import { Button } from "@/components/ui/button";

export const ResultsScreen: React.FC = () => {
  const [isExiting, setIsExiting] = useState(false);
  const { state, dispatch } = useGameState();
  const { firstRoundReady, gameResults, maxTimePerRound } = state;

  const handleStartGame = () => {
    dispatch({ type: "START_GAME" });
  };

  const finalScore = useMemo(
    () => calculateTotalScore(gameResults, maxTimePerRound),
    [gameResults, maxTimePerRound]
  );

  const headingMsg = useMemo(
    () => getScoreHeadingMessage(finalScore),
    [finalScore]
  );

  const formattedResults = useMemo(
    () => formatGameResults(gameResults),
    [gameResults]
  );

  return (
    <Overlay isExiting={isExiting} onExited={handleStartGame}>
      <h1>{headingMsg}</h1>
      <div className="flex flex-col gap-2">
        {formattedResults.map(({ round, result }) => (
          <p key={round}>
            Round {round}: {result}
          </p>
        ))}
      </div>
      <Button disabled={!firstRoundReady} onClick={() => setIsExiting(true)}>
        Play Again
      </Button>
    </Overlay>
  );
};
