import { ThemeUIStyleObject, Button, Text, Box } from "theme-ui";
import { RoundResult } from "../App";
import { Overlay } from "./overlay";
import {
  calculateTotalScore,
  formatRoundResult,
  formatScoreMessage,
} from "../utils";
import { useState, useMemo } from "react";

type Props = {
  gameResults: RoundResult[];
  onPlayAgain: () => void;
};

const styles: Record<string, ThemeUIStyleObject> = {
  rounds: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
};

export const ResultsScreen: React.FC<Props> = ({
  gameResults,
  onPlayAgain,
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const finalScore = calculateTotalScore(gameResults);
  const formattedResults = useMemo(
    () =>
      gameResults.map((result, index) => ({
        round: index + 1,
        result: formatRoundResult(result.distance),
      })),
    [gameResults]
  );

  return (
    <Overlay isFadingOut={isFadingOut} onFadeOutComplete={onPlayAgain}>
      <Text sx={styles.score}>{formatScoreMessage(finalScore)}</Text>
      <Box sx={styles.rounds}>
        {formattedResults.map(({ round, result }) => (
          <Text key={round}>
            Round {round}: {result}
          </Text>
        ))}
      </Box>
      <Button onClick={() => setIsFadingOut(true)}>Play Again</Button>
    </Overlay>
  );
};
