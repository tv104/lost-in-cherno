import { Box, Global } from "theme-ui";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import { LatLngTuple, LatLngBoundsLiteral } from "leaflet";
import { useState, useCallback, useRef, useEffect } from "react";
import { GAME_CONFIG } from "../../utils";
import { createStyles, globalStyles } from "./guess-map-styles";
import {
  AddMarkerOnClick,
  ZoomOutOnTransition,
  FitBoundsOnAnswer,
} from "./guess-map-helpers";
import { GuessMapInfo } from "./guess-map-info";
import L from "leaflet";
import { GuessMapButton } from "./guess-map-button";

const MAX_MAP_BOUNDS: LatLngBoundsLiteral = [
  [-90, -180],
  [90, 180],
];

type Props = {
  guessLocation: LatLngTuple | null;
  setGuessLocation: (pos: LatLngTuple) => void;
  panoramaLocation: LatLngTuple;
  showAnswer: boolean;
  onMapButtonClick: () => void;
  mapButtonDisabled: boolean;
  mapMarkerDisabled: boolean;
  currentRound: number;
  timeLeft: number;
  isTransitioningRound: boolean;
  gameCount: number;
};

export const GuessMap: React.FC<Props> = ({
  guessLocation,
  setGuessLocation,
  panoramaLocation,
  showAnswer,
  onMapButtonClick,
  mapButtonDisabled,
  mapMarkerDisabled,
  currentRound,
  timeLeft,
  isTransitioningRound,
  gameCount,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      if (!showAnswer) {
        setIsExpanded(false);
      }
    }, 1000);
  }, [showAnswer]);

  const handleMouseEnter = useCallback(() => {
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
            currentRound={
              isTransitioningRound ? currentRound + 1 : currentRound
            }
            maxRounds={GAME_CONFIG.ROUNDS_PER_GAME}
            timeLeft={timeLeft}
            showAnswer={showAnswer}
          />
          <MapContainer
            center={[0, 0]}
            zoom={1}
            minZoom={0}
            maxZoom={6}
            maxBounds={MAX_MAP_BOUNDS}
            crs={L.CRS.EPSG3857}
            className="map"
            wheelPxPerZoomLevel={180}
            maxBoundsViscosity={1.0}
          >
            <TileLayer url="tiles/chernarus/{z}/{x}/{y}.webp" noWrap={true} />
            <AddMarkerOnClick
              setLocation={setGuessLocation}
              disabled={mapMarkerDisabled}
            />
            <FitBoundsOnAnswer
              showAnswer={showAnswer}
              panoramaLocation={panoramaLocation}
              guessLocation={guessLocation}
            />
            <ZoomOutOnTransition
              transitioning={isTransitioningRound}
              gameCount={gameCount}
            />
            {guessLocation && <Marker position={guessLocation} />}
            {showAnswer && guessLocation && panoramaLocation && (
              <Polyline positions={[panoramaLocation, guessLocation]} />
            )}
            {showAnswer && panoramaLocation && (
              <Marker position={panoramaLocation} />
            )}
          </MapContainer>

          <GuessMapButton
            showAnswer={showAnswer}
            currentRound={currentRound}
            maxRounds={GAME_CONFIG.ROUNDS_PER_GAME}
            disabled={mapButtonDisabled}
            onClick={onMapButtonClick}
          />
        </Box>
      </Box>
    </>
  );
};
