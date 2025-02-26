import { LatLngTuple } from 'leaflet';

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
}

export interface GameStateType {
  // Game state
  currentRound: number;
  gameResults: RoundResult[];
  phase: GamePhase;
  gameLocations: LocationConfig[];
  gameCount: number;
  
  // Round state
  guessLocation: LatLngTuple | null;
  roundActive: boolean;
  firstRoundReady: boolean;
  nextRoundReady: boolean;
  isTransitioningRound: boolean;
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
