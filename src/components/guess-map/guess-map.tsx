import { Box, Global } from "theme-ui";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import { LatLngBoundsLiteral } from "leaflet";
import { useState, useCallback, useRef, useEffect } from "react";
import { createStyles, globalStyles } from "./guess-map-styles";
import {
  AddMarkerOnClick,
  ZoomOutOnTransition,
  FitBoundsOnAnswer,
} from "./guess-map-helpers";
import { GuessMapInfo } from "./guess-map-info";
import L from "leaflet";
import { GuessMapButton } from "./guess-map-button";
import { GuessMapLocationLabels } from "./guess-map-location-labels";
import { GuessMapMarker } from "./guess-map-marker";
import { useGameStateContext } from "../../contexts";

const MAX_MAP_BOUNDS: LatLngBoundsLiteral = [
  [-90, -180],
  [90, 180],
];

export const GuessMap: React.FC = () => {
  const {
    guessLocation,
    handleSetGuessLocation,
    gameLocations,
    currentRound,
    showAnswer,
    handleMapButtonClick,
    disableMapButton,
    disableMapMarker,
    timeLeft,
    isTransitioningRound,
    gameCount,
    mapId,
    maxRounds,
  } = useGameStateContext();

  const roundLocation = gameLocations[currentRound - 1].location;
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
            maxRounds={maxRounds}
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
            <TileLayer url={`tiles/${mapId}/{z}/{x}/{y}.webp`} noWrap={true} />
            <GuessMapLocationLabels />
            <AddMarkerOnClick
              setLocation={handleSetGuessLocation}
              disabled={disableMapMarker}
            />
            <FitBoundsOnAnswer
              showAnswer={showAnswer}
              locationA={roundLocation}
              locationB={guessLocation}
            />
            <ZoomOutOnTransition
              transitioning={isTransitioningRound}
              gameCount={gameCount}
            />
            {guessLocation && <GuessMapMarker position={guessLocation} />}
            {showAnswer && guessLocation && (
              <Polyline positions={[roundLocation, guessLocation]} />
            )}
            {showAnswer && <GuessMapMarker position={roundLocation} />}
          </MapContainer>

          <GuessMapButton
            showAnswer={showAnswer}
            currentRound={currentRound}
            maxRounds={maxRounds}
            disabled={disableMapButton}
            onClick={handleMapButtonClick}
          />
        </Box>
      </Box>
    </>
  );
};
