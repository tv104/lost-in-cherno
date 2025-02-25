import { Box, Text, ThemeUIStyleObject } from "theme-ui";
import { formatTime } from "../../utils";
import { BUTTON_HEIGHT } from "./guess-map-styles";

type GuessMapInfoProps = {
  currentRound: number;
  timeLeft: number;
  showAnswer: boolean;
  maxRounds: number;
};

const PULSE = {
  from: { color: "white" },
  to: { color: "red" },
};

const getTimeLeftStyles = (
  timeLeft: number,
  showAnswer: boolean
): ThemeUIStyleObject => {
  if (showAnswer) return {};

  if (timeLeft <= 5) {
    return {
      animation: "pulse .5s ease-in-out infinite alternate",
      "@keyframes pulse": PULSE,
    };
  }

  if (timeLeft <= 10) {
    return {
      animation: "pulse 1s ease-in-out infinite alternate",
      "@keyframes pulse": PULSE,
    };
  }

  return {};
};

const styles: Record<string, ThemeUIStyleObject> = {
  info: {
    position: "absolute",
    top: -BUTTON_HEIGHT - 4,
    color: "white",
    right: 0,
    left: 0,
    height: BUTTON_HEIGHT,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    textShadow: "overlay",
  },
  timeLeft: {
    fontFamily: "monospace",
    fontVariantNumeric: "tabular-nums",
    fontSize: "1.1rem",
  },
};

export const GuessMapInfo: React.FC<GuessMapInfoProps> = ({
  currentRound,
  timeLeft,
  showAnswer,
  maxRounds,
}) => {
  return (
    <Box sx={styles.info}>
      <Text>
        Round {currentRound}/{maxRounds}
      </Text>
      <Text>
        Time left:{" "}
        <Text
          sx={{
            ...styles.timeLeft,
            ...getTimeLeftStyles(timeLeft, showAnswer),
          }}
        >
          {formatTime(timeLeft)}s
        </Text>
      </Text>
    </Box>
  );
};
