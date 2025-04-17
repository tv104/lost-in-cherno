import { LatLngTuple } from 'leaflet';
import { MapLabel } from './map-labels';

export type GamePhase = 'menu' | 'game' | 'results';

export type RoundResult = {
  locationId: string;
  distance: number | null;
  timeLeft: number;
};

export type LocationConfig = {
  id: string;
  image: string;
  location: LatLngTuple;
  panCorrection: number;
}

export interface GameState {
  // Game state
  allLocations: LocationConfig[];
  currentRound: number;
  gameResults: RoundResult[];
  phase: GamePhase;
  gameLocations: LocationConfig[];
  gameCount: number;
  mapId: string; // Used for map tile source
  maxRounds: number;
  maxTimePerRound: number;
  mapLabels: MapLabel[];

  // Round state
  guessLocation: LatLngTuple | null;
  roundActive: boolean;
  firstRoundReady: boolean;
  nextRoundReady: boolean;
  isTransitioningRound: boolean;
}