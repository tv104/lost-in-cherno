import { Box, Button, Global } from "theme-ui";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import { LatLngTuple } from "leaflet";
import { useState, useCallback, useRef, useEffect } from "react";
import { GAME_CONFIG } from "../../utils";
import { createStyles, globalStyles } from "./guess-map-styles";
import {
  AddMarkerOnClick,
  ZoomOutOnNewRound,
  FitBoundsOnAnswer,
} from "./guess-map-components";
import { GuessMapInfo } from "./guess-map-info";
import { GuessMapResult } from "./guess-map-result";
import L from "leaflet";

type Props = {
  playerLocation: LatLngTuple | null;
  setPlayerLocation: (pos: LatLngTuple) => void;
  location: LatLngTuple;
  showAnswer: boolean;
  onSubmit: () => void;
  onNext: () => void;
  currentRound: number;
  timeLeft: number;
  isPlaying: boolean;
};

const getButtonText = (showAnswer: boolean, currentRound: number): string => {
  if (showAnswer) {
    return currentRound >= GAME_CONFIG.ROUNDS_PER_GAME
      ? "Results"
      : "Next round";
  }
  return "Guess";
};

const GuessMap: React.FC<Props> = ({
  playerLocation,
  setPlayerLocation,
  location,
  showAnswer,
  onSubmit,
  onNext,
  currentRound,
  timeLeft,
  isPlaying,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  const handleMouseLeave = useCallback(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    // Set a new timeout
    timeoutRef.current = window.setTimeout(() => {
      if (!showAnswer) {
        setIsExpanded(false);
      }
    }, 1000);
  }, [showAnswer]);

  const handleMouseEnter = useCallback(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    setIsExpanded(true);
  }, []);

  useEffect(() => {
    if (showAnswer) {
      setIsExpanded(true);
    }
  }, [showAnswer]);

  const styles = createStyles(isExpanded);

  return (
    <>
      <Global styles={globalStyles} />
      <Box sx={styles.container}>
        <Box onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <GuessMapInfo
            currentRound={currentRound}
            maxRounds={GAME_CONFIG.ROUNDS_PER_GAME}
            timeLeft={timeLeft}
            showAnswer={showAnswer}
          />
          <MapContainer
            center={[0, 0]}
            zoom={2}
            minZoom={1}
            maxZoom={6}
            maxBounds={[
              [-90, -180],
              [90, 180],
            ]}
            crs={L.CRS.EPSG3857}
            className="map"
          >
            <TileLayer url="tiles/chernarus/{z}/{x}/{y}.webp" noWrap={true} />
            <AddMarkerOnClick
              setLocation={setPlayerLocation}
              disabled={showAnswer || !isPlaying}
            />
            <FitBoundsOnAnswer
              showAnswer={showAnswer}
              location={location}
              playerLocation={playerLocation}
            />
            <ZoomOutOnNewRound currentRound={currentRound} />
            {showAnswer && location && <Marker position={location} />}
            {playerLocation && <Marker position={playerLocation} />}
            {showAnswer && playerLocation && location && (
              <Polyline positions={[location, playerLocation]} />
            )}
          </MapContainer>
          {showAnswer && (
            <GuessMapResult
              playerLocation={playerLocation}
              location={location}
            />
          )}
          <Button
            variant="secondary"
            sx={styles.button}
            onClick={showAnswer ? onNext : onSubmit}
          >
            {getButtonText(showAnswer, currentRound)}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default GuessMap;
