import { ThemeUIStyleObject } from "theme-ui";
import { Text } from "theme-ui";
import { LatLngTuple } from "leaflet";
import { calculateDistance, getRandomDistanceItem } from "../../utils";

type GuessMapResultProps = {
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
  return `${distance} ${getRandomDistanceItem(distance)} away`;
};

const styles: Record<string, ThemeUIStyleObject> = {
  container: {
    position: "absolute",
    top: "352px",
    left: 0,
    right: 0,
    color: "white",
    fontWeight: "bold",
    textShadow: "game",
    fontSize: 4,
    whiteSpace: "pre-line",
    textAlign: "center",
    textTransform: "uppercase",
  },
};

export const GuessMapResult: React.FC<GuessMapResultProps> = ({
  guessLocation,
  panoramaLocation,
}) => (
  <Text sx={styles.container}>
    {getResultMessage(guessLocation, panoramaLocation)}
  </Text>
);
