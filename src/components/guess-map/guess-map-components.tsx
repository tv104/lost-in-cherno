import { LeafletMouseEvent, LatLngTuple } from "leaflet";
import { useMapEvent, useMap } from "react-leaflet";
import { useEffect } from "react";

export const AddMarkerOnClick = ({
  setLocation,
  disabled,
}: {
  setLocation: (pos: LatLngTuple) => void;
  disabled: boolean;
}) => {
  useMapEvent("click", (e: LeafletMouseEvent) => {
    if (disabled) return;
    const newMarker: LatLngTuple = [e.latlng.lat, e.latlng.lng];
    setLocation(newMarker);
  });
  return null;
};

export const FitBoundsOnAnswer = ({
  showAnswer,
  panoramaLocation,
  guessLocation,
}: {
  showAnswer: boolean;
  panoramaLocation: LatLngTuple;
  guessLocation: LatLngTuple | null;
}) => {
  const map = useMap();

  useEffect(() => {
    if (showAnswer && panoramaLocation && guessLocation) {
      map.fitBounds([panoramaLocation, guessLocation], {
        padding: [120, 120],
        duration: 1,
      });
    } else if (showAnswer && panoramaLocation) {
      map.fitBounds([panoramaLocation], {
        duration: 1,
        maxZoom: 1,
      });
    }
  }, [showAnswer, panoramaLocation, guessLocation, map]);

  return null;
};

export const ZoomOutOnNewRound = ({
  currentRound,
}: {
  currentRound: number;
}) => {
  const map = useMap();
  useEffect(() => {
    map.setZoom(1);
  }, [currentRound, map]);

  return null;
};
