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
  location,
  playerLocation,
}: {
  showAnswer: boolean;
  location?: LatLngTuple;
  playerLocation: LatLngTuple | null;
}) => {
  const map = useMap();

  useEffect(() => {
    if (showAnswer && location && playerLocation) {
      map.fitBounds([location, playerLocation], {
        padding: [100, 100],
        duration: 1,
      });
    } else if (showAnswer && location) {
      map.fitBounds([location], {
        duration: 1,
        maxZoom: 1,
      });
    }
  }, [showAnswer, location, playerLocation, map]);

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
