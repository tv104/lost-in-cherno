import { LocationConfig } from "./game-state";

export interface GameConfig {
  id: "chernarus";  // Only 1 map implemented
  locations: LocationConfig[];
  maxRounds: number;
  timePerRound: number;
}
