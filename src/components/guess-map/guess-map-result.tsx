import { ThemeUIStyleObject } from "theme-ui";
import { Text } from "theme-ui";
import { LatLngTuple } from "leaflet";
import { calculateDistance, getRandomDistanceItem } from "../../utils";
import { BUTTON_HEIGHT, GAP } from "./guess-map-styles";

type GuessMapResultProps = {
  playerLocation: LatLngTuple | null;
  location: LatLngTuple;
};

const getResultMessage = (
  playerLocation: LatLngTuple | null,
  location: LatLngTuple
) => {
  if (!playerLocation) {
    return `You are dead`;
  }

  const distance = Math.round(calculateDistance(playerLocation, location));
  return `${distance} ${getRandomDistanceItem(distance)} away`;
};

const styles: Record<string, ThemeUIStyleObject> = {
  container: {
    position: "absolute",
    bottom: BUTTON_HEIGHT + GAP + 48,
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
  playerLocation,
  location,
}) => (
  <Text sx={styles.container}>
    {getResultMessage(playerLocation, location)}
  </Text>
);
