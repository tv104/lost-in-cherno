import { ThemeUIStyleObject, Button, Text, Box, Heading } from "theme-ui";
import { type RoundResult } from "../utils";
import { Overlay } from "./overlay";
import {
  calculateTotalScore,
  formatRoundResult,
  getHighScore,
  updateHighScore,
} from "../utils";
import { useState, useMemo } from "react";

type Props = {
  disableStartButton: boolean;
  gameResults: RoundResult[];
  onStartGame: () => void;
};

const styles: Record<string, ThemeUIStyleObject> = {
  rounds: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
};

export const ResultsScreen: React.FC<Props> = ({
  disableStartButton,
  gameResults,
  onStartGame,
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const finalScore = calculateTotalScore(gameResults);

  const headingMsg = useMemo(() => {
    const highScore = getHighScore();
    const isNewHighScore = finalScore >= highScore;
    if (isNewHighScore) {
      updateHighScore(finalScore);
      return `New High Score! ${finalScore}`;
    }
    return `Score: ${finalScore} (Max: ${highScore})`;
  }, [finalScore]);

  const formattedResults = useMemo(
    () =>
      gameResults.map((result, index) => ({
        round: index + 1,
        result: formatRoundResult(result.distance, result.timeLeft),
      })),
    [gameResults]
  );

  return (
    <Overlay isFadingOut={isFadingOut} onFadeOutComplete={onStartGame}>
      <Heading>{headingMsg}</Heading>
      <Box sx={styles.rounds}>
        {formattedResults.map(({ round, result }) => (
          <Text key={round}>
            Round {round}: {result}
          </Text>
        ))}
      </Box>
      <Button
        disabled={disableStartButton}
        onClick={() => setIsFadingOut(true)}
      >
        Play Again
      </Button>
    </Overlay>
  );
};
