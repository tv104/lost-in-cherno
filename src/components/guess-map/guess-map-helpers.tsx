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
  locationA,
  locationB,
}: {
  showAnswer: boolean;
  locationA: LatLngTuple;
  locationB: LatLngTuple | null;
}) => {
  const map = useMap();

  useEffect(() => {
    if (showAnswer && locationA && locationB) {
      map.fitBounds([locationA, locationB], {
        padding: [80, 80],
        duration: 1,
      });
    } else if (showAnswer && locationA) {
      map.fitBounds([locationA], {
        duration: 1,
        maxZoom: 1,
      });
    }
  }, [showAnswer, locationA, locationB, map]);

  return null;
};

export const ZoomOutOnTransition = ({
  transitioning,
  gameCount,
}: {
  transitioning: boolean;
  gameCount: number;
}) => {
  const map = useMap();

  useEffect(() => {
    if (transitioning) {
      map.setZoom(1, { animate: true });
      map.setView([0, 0], 1, { animate: true });
    }
  }, [transitioning, map]);

  useEffect(() => {
    map.setZoom(1, { animate: true });
    map.setView([0, 0], 1, { animate: true });
  }, [gameCount, map]);

  return null;
};
