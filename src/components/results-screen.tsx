import { ThemeUIStyleObject, Box, Button, Text } from "theme-ui";
import { RoundResult } from "../App";
import { Footer } from "./footer";

type Props = {
  visible: boolean;
  gameResults: RoundResult[];
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
  gameResults,
  onPlayAgain,
}) => {
  if (!visible) return null;

  console.log(gameResults);

  return (
    <Box sx={styles.container}>
      <Box sx={styles.contentContainer}>
        <Box sx={styles.rounds}>
          {gameResults.map((result, index) => (
            <Text key={index}>
              Round {index + 1}:{" "}
              {result.distance !== null
                ? `${Math.round(result.distance)}m`
                : "Timed out"}
            </Text>
          ))}
        </Box>
        <Button onClick={onPlayAgain}>Play Again</Button>
      </Box>
      <Footer sx={styles.footer} />
    </Box>
  );
};
