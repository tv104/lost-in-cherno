import { ThemeUIStyleObject, Button, Text, Box, Heading } from "theme-ui";
import { Overlay } from "./overlay";
import {
  calculateTotalScore,
  formatGameResults,
  getScoreHeadingMessage,
} from "../../utils";
import { useState, useMemo } from "react";
import { useGameStateContext } from "../../contexts";

const styles: Record<string, ThemeUIStyleObject> = {
  rounds: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
};

export const ResultsScreen: React.FC = () => {
  const { handleStartGame, firstRoundReady, gameResults, maxTimePerRound } =
    useGameStateContext();
  const [isExiting, setIsExiting] = useState(false);

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
      <Heading>{headingMsg}</Heading>
      <Box sx={styles.rounds}>
        {formattedResults.map(({ round, result }) => (
          <Text key={round}>
            Round {round}: {result}
          </Text>
        ))}
      </Box>
      <Button disabled={!firstRoundReady} onClick={() => setIsExiting(true)}>
        Play Again
      </Button>
    </Overlay>
  );
};
