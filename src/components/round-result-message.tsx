import { ThemeUIStyleObject } from "theme-ui";
import { Heading } from "theme-ui";
import { LatLngTuple } from "leaflet";
import { calculateDistance, getRandomDistanceItem } from "../utils";
import { useMemo } from "react";

type RoundResultMessageProps = {
  guessLocation: LatLngTuple | null;
  panoramaLocation: LatLngTuple;
};

const getResultMessage = (
  guessLocation: LatLngTuple | null,
  panoramaLocation: LatLngTuple
) => {
  if (!guessLocation) {
    return `You are dead`;
  }

  const distance = Math.round(
    calculateDistance(guessLocation, panoramaLocation)
  );
  return `${distance.toLocaleString()} ${getRandomDistanceItem(distance)} away`;
};

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
    textShadow: "game",
    textTransform: "uppercase",
    zIndex: "map",
    pointerEvents: "none",
  },
};

export const RoundResultMessage: React.FC<RoundResultMessageProps> = ({
  guessLocation,
  panoramaLocation,
}) => {
  const message = useMemo(
    () => getResultMessage(guessLocation, panoramaLocation),
    [guessLocation, panoramaLocation]
  );

  return (
    <Heading sx={styles.container} as="h1">
      {message}
    </Heading>
  );
};
