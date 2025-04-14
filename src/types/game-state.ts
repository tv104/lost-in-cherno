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

export interface GameStateType {
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

  // Computed values
  // disableMapButton: boolean;
  // disableMapMarker: boolean;
  // showAnswer: boolean;

  // Time state
  // timeLeft: number;
}

export interface GameStateContextType extends GameStateType {
  // Handlers
  resetTimer: () => void;
  handleRoundEnd: (timerExpired?: boolean) => void;
  handleStartGame: () => void;
  handleGameEnd: () => void;
  handleSetGuessLocation: (location: LatLngTuple) => void;
  handleCurrentPanoramicImgReady: () => void;
  handleNextPanoramicImgReady: () => void;
  handleTransitionToNextRound: () => void;
  handleStartRound: () => void;
  handleMapButtonClick: () => void;
  handlePanoramaTransitionEnd: () => void;

  // Computed values
  disableMapButton: boolean;
  disableMapMarker: boolean;
  showAnswer: boolean;

  // Time state
  timeLeft: number;
} 
