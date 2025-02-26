import { Box, Global } from "theme-ui";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import { LatLngBoundsLiteral } from "leaflet";
import { useState, useCallback, useRef, useEffect } from "react";
import { GAME_CONFIG } from "../../config";
import { createStyles, globalStyles } from "./guess-map-styles";
import {
  AddMarkerOnClick,
  ZoomOutOnTransition,
  FitBoundsOnAnswer,
} from "./guess-map-helpers";
import { GuessMapInfo } from "./guess-map-info";
import L from "leaflet";
import { GuessMapButton } from "./guess-map-button";
import { useGameStateContext } from "../../contexts";

const MAX_MAP_BOUNDS: LatLngBoundsLiteral = [
  [-90, -180],
  [90, 180],
];

export const GuessMap: React.FC = () => {
  const {
    guessLocation,
    handleSetGuessLocation,
    panoramas,
    currentRound,
    showAnswer,
    handleMapButtonClick,
    disableMapButton,
    disableMapMarker,
    timeLeft,
    isTransitioningRound,
    gameCount,
  } = useGameStateContext();

  const panoramaLocation = panoramas[currentRound - 1].location;
  const [isExpanded, setIsExpanded] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      if (!showAnswer && !guessLocation) {
        setIsExpanded(false);
      }
    }, 1000);
  }, [showAnswer, guessLocation]);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    setIsExpanded(true);
  }, []);

  useEffect(() => {
    if (showAnswer || guessLocation) {
      setIsExpanded(true);
    }
  }, [showAnswer, guessLocation]);

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
            timeLeft={
              isTransitioningRound ? GAME_CONFIG.SECONDS_PER_ROUND : timeLeft
            }
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
              setLocation={handleSetGuessLocation}
              disabled={disableMapMarker}
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
            disabled={disableMapButton}
            onClick={handleMapButtonClick}
          />
        </Box>
      </Box>
    </>
  );
};
