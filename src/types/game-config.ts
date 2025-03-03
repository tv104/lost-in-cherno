import { LocationConfig } from "./game-state";
import { MapLabel } from "./map-labels";

export interface GameConfig {
  id: "chernarus";  // Only 1 map implemented
  locations: LocationConfig[];
  mapLabels: MapLabel[];
  maxRounds: number;
  timePerRound: number;
}
