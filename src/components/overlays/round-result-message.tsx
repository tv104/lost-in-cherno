import { ThemeUIStyleObject } from "theme-ui";
import { Heading } from "theme-ui";
import { getResultMessage } from "../../utils";
import { useMemo } from "react";
import { useGameStateContext } from "../../contexts";

const styles: Record<string, ThemeUIStyleObject> = {
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    textShadow: "overlay",
    textTransform: "uppercase",
    zIndex: "overlay",
    pointerEvents: "none",
  },
};

export const RoundResultMessage: React.FC = () => {
  const { guessLocation, panoramas, currentRound, showAnswer } =
    useGameStateContext();

  const panoramaLocation = panoramas[currentRound - 1].location;

  const message = useMemo(
    () => getResultMessage(guessLocation, panoramaLocation),
    [guessLocation, panoramaLocation]
  );

  if (!showAnswer) {
    return null;
  }

  return (
    <Heading sx={styles.container} as="h1">
      {message}
    </Heading>
  );
};
