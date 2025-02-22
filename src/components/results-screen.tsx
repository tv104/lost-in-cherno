import { ThemeUIStyleObject, Box, Button, Text } from "theme-ui";
import { GuessedLocation } from "../App";
import { Footer } from "./footer";

type Props = {
  visible: boolean;
  guessedLocations: GuessedLocation[];
  onPlayAgain: () => void;
};

const styles: Record<string, ThemeUIStyleObject> = {
  container: {
    backgroundColor: "background",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "menu",
    p: 4,
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    marginTop: "auto",
    marginBottom: "auto",
  },
  score: {
    fontSize: 4,
    fontWeight: "bold",
  },
  rounds: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  footer: {
    marginTop: "auto",
  },
};

export const ResultsScreen: React.FC<Props> = ({
  visible,
  guessedLocations,
  onPlayAgain,
}) => {
  if (!visible) return null;

  const totalScore = guessedLocations.reduce(
    (acc, curr) => acc + curr.distance,
    0
  );
  const averageScore = Math.round(totalScore / guessedLocations.length);

  return (
    <Box sx={styles.container}>
      <Box sx={styles.contentContainer}>
        <Text sx={styles.score}>Average distance: {averageScore}m</Text>
        <Box sx={styles.rounds}>
          {guessedLocations.map((guess, index) => (
            <Text key={index}>
              Round {index + 1}: {Math.round(guess.distance)}m
            </Text>
          ))}
        </Box>
        <Button onClick={onPlayAgain}>Play Again</Button>
      </Box>
      <Footer sx={styles.footer} />
    </Box>
  );
};
