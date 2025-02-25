import { ThemeUIStyleObject } from "theme-ui";
import { Heading } from "theme-ui";
import { LatLngTuple } from "leaflet";
import { getResultMessage } from "../../utils";
import { useMemo } from "react";

type RoundResultMessageProps = {
  guessLocation: LatLngTuple | null;
  panoramaLocation: LatLngTuple;
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
    textShadow: "overlay",
    textTransform: "uppercase",
    zIndex: "overlay",
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
