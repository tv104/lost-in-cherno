import { ThemeUIStyleObject, Button, Text, Box, Heading } from "theme-ui";
import { type RoundResult } from "../utils";
import { Overlay } from "./overlay";
import {
  calculateTotalScore,
  formatGameResults,
  getScoreHeadingMessage,
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
  const [isExiting, setIsExiting] = useState(false);
  const finalScore = calculateTotalScore(gameResults);

  const headingMsg = useMemo(
    () => getScoreHeadingMessage(finalScore),
    [finalScore]
  );

  const formattedResults = useMemo(
    () => formatGameResults(gameResults),
    [gameResults]
  );

  return (
    <Overlay isExiting={isExiting} onExited={onStartGame}>
      <Heading>{headingMsg}</Heading>
      <Box sx={styles.rounds}>
        {formattedResults.map(({ round, result }) => (
          <Text key={round}>
            Round {round}: {result}
          </Text>
        ))}
      </Box>
      <Button disabled={disableStartButton} onClick={() => setIsExiting(true)}>
        Play Again
      </Button>
    </Overlay>
  );
};
