import { Box, Global } from "theme-ui";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import { LatLngBoundsLiteral, LatLngTuple } from "leaflet";
import { useState } from "react";
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
import { calculateDistance } from "../../utils/distance";
import {
  useRoundTimer,
  useDisableMapMarker,
  useShowAnswer,
  useMapExpansion,
  useMapButton,
  useGameState,
} from "../../hooks";

const MAX_MAP_BOUNDS: LatLngBoundsLiteral = [
  [-90, -180],
  [90, 180],
];

export const GuessMap: React.FC = () => {
  const { state, dispatch } = useGameState();
  const {
    guessLocation,
    gameLocations,
    currentRound,
    isTransitioningRound,
    gameCount,
    mapId,
    maxRounds,
    roundActive,
    maxTimePerRound,
    mapLabels,
  } = state;

  const roundLocation = gameLocations[currentRound - 1].location;
  const [isExpanded, setIsExpanded] = useState(false);

  const { timeLeft, resetTimer } = useRoundTimer({
    initialTime: maxTimePerRound,
    isActive: roundActive,
    onTimeUp: () => handleTimeUp(),
  });

  const disableMapMarker = useDisableMapMarker({ state });
  const showAnswer = useShowAnswer({ state });
  const { mapButtonDisabled, handleMapButtonClick } = useMapButton({
    state,
    timeLeft,
    showAnswer,
    resetTimer,
    dispatch,
  });

  const handleTimeUp = () => {
    const distance = guessLocation
      ? calculateDistance(guessLocation, roundLocation)
      : null;

    dispatch({
      type: "END_ROUND",
      payload: {
        locationId: gameLocations[currentRound - 1].id,
        distance,
        timeLeft: timeLeft,
      },
    });
  };

  const { handleMouseLeave, handleMouseEnter } = useMapExpansion({
    showAnswer,
    guessLocation,
    setIsExpanded,
  });

  const styles = createStyles(isExpanded);

  const handleSetGuessLocation = (pos: LatLngTuple) => {
    dispatch({ type: "SET_GUESS_LOCATION", payload: { location: pos } });
  };

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
            <TileLayer url={`tiles/${mapId}/{z}/{x}/{y}.webp`} noWrap />
            <GuessMapLocationLabels mapLabels={mapLabels} />
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
            disabled={mapButtonDisabled}
            onClick={handleMapButtonClick}
          />
        </Box>
      </Box>
    </>
  );
};
