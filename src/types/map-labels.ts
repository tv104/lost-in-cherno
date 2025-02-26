import { LatLngTuple } from "leaflet";

export type MapLabel = {
  position: LatLngTuple;
  name: string;
  importance: number;
};
