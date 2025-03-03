import { useState, useCallback, useMemo, useEffect } from 'react';
import { LatLngTuple } from 'leaflet';
import { 
  calculateDistance, 
  saveRoundLocation,
  getNewGameLocations,
} from '../utils';
import { useRoundTimer } from './use-round-timer';
import { GameStateType, GameStateContextType, RoundResult, GameConfig } from '../types';
const createInitialState = (config: GameConfig): GameStateType => ({
  currentRound: 1,
  gameResults: [],
  phase: 'menu',
  gameLocations: getNewGameLocations(config.locations, config.maxRounds),
  gameCount: 0,
  mapId: config.id,
  maxRounds: config.maxRounds,
  maxTimePerRound: config.timePerRound,

  guessLocation: null,
  roundActive: false,
  firstRoundReady: false,
  nextRoundReady: false,
  isTransitioningRound: false,
});

export function useGameState(gameConfig: GameConfig): GameStateContextType {
  const [state, setState] = useState<GameStateType>(() => 
    createInitialState(gameConfig)
  );
  
  const { 
    currentRound, gameResults, phase, gameLocations, gameCount,
    guessLocation, roundActive, isTransitioningRound, maxRounds, maxTimePerRound
  } = state;

  const { timeLeft, resetTimer } = useRoundTimer({
    initialTime: maxTimePerRound,
    isActive: roundActive,
    onTimeUp: () => handleRoundEnd(true),
  });
  
  const updateState = useCallback((updates: Partial<GameStateType>) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      return newState;
    });
  }, []);

  // Game logic handlers
  const handleRoundEnd = useCallback((timerExpired = false) => {
    const distance = guessLocation
      ? calculateDistance(guessLocation, gameLocations[currentRound - 1].location)
      : null;

    const updatedGameResults: RoundResult[] = [
      ...gameResults,
      {
        locationId: gameLocations[currentRound - 1].id,
        distance,
        timeLeft: timerExpired ? 0 : timeLeft,
      },
    ];

    saveRoundLocation(gameLocations[currentRound - 1].id);
    
    updateState({
      gameResults: updatedGameResults,
      roundActive: false
    });
  }, [gameLocations, currentRound, gameResults, guessLocation, timeLeft, updateState]);

  const handleStartGame = useCallback(() => {
    updateState({
      phase: 'game',
      gameResults: [],
      roundActive: true,
    });
  }, [updateState]);

  const handleGameEnd = useCallback(() => {
    const newLocations = getNewGameLocations(
      gameLocations,
      maxRounds
    );
    
    // prepare state for next game
    updateState({
      currentRound: 1,
      phase: 'results',
      gameLocations: newLocations,
      gameCount: gameCount + 1,
      guessLocation: null,
      roundActive: false,
      firstRoundReady: false,
      nextRoundReady: false,
      isTransitioningRound: false,
    });
    resetTimer();
  }, [gameLocations, maxRounds, gameCount, updateState, resetTimer]);

  const handleSetGuessLocation = useCallback((location: LatLngTuple) => {
    updateState({ guessLocation: location });
  }, [updateState]);

  const handleCurrentPanoramicImgReady = useCallback(() => {
    if (phase === 'menu' || phase === 'results') {
      updateState({ firstRoundReady: true });
    }
  }, [phase, updateState]);

  const handleNextPanoramicImgReady = useCallback(() => {
    updateState({ nextRoundReady: true });
  }, [updateState]);

  const handleTransitionToNextRound = useCallback(() => {
    updateState({
      guessLocation: null,
      isTransitioningRound: true
    });
    resetTimer();
  }, [updateState, resetTimer]);

  const handleStartRound = useCallback(() => {
    updateState({
      currentRound: currentRound + 1,
      roundActive: true,
      nextRoundReady: false,
      isTransitioningRound: false
    });

  }, [currentRound, updateState]);

  const [mapButtonDisabled, setMapButtonDisabled] = useState(false);

  const handleMapButtonClick = useCallback(() => {
    if (mapButtonDisabled) return;

    setMapButtonDisabled(true);

    if (roundActive && guessLocation) {
      handleRoundEnd();
    } else if (!roundActive) {
      if (currentRound >= gameConfig.maxRounds) {
        handleGameEnd();
      } else {
        handleTransitionToNextRound();
      }
    }

    setTimeout(() => {
      setMapButtonDisabled(false);
    }, 500);
  }, [
    mapButtonDisabled,
    roundActive,
    guessLocation,
    handleRoundEnd,
    currentRound,
    handleGameEnd,
    handleTransitionToNextRound,
    gameConfig
  ]);

  const handlePanoramaTransitionEnd = useCallback(() => {
    if (isTransitioningRound) {
      handleStartRound();
    }
  }, [isTransitioningRound, handleStartRound]);

  // Computed values
  const disableMapButton = useMemo(() => {
    if (mapButtonDisabled) return true;
    return timeLeft > 0 && !guessLocation;
  }, [mapButtonDisabled, timeLeft, guessLocation]);

  const disableMapMarker = useMemo(() => {
    return phase !== 'game' || !roundActive || isTransitioningRound;
  }, [phase, roundActive, isTransitioningRound]);

  const showAnswer = useMemo(() => {
    return phase === 'game' && !roundActive && !isTransitioningRound;
  }, [phase, roundActive, isTransitioningRound]);

  // Disable button upon answer reveal to prevent unintentional clicks
  useEffect(() => {
    if (showAnswer) {
      setMapButtonDisabled(true);
      
      const timeout = setTimeout(() => {
        setMapButtonDisabled(false);
      }, 500);
      
      return () => clearTimeout(timeout);
    }
  }, [showAnswer]);

  return {
    // State
    ...state,
    
    // Handlers
    resetTimer,
    handleRoundEnd,
    handleStartGame,
    handleGameEnd,
    handleSetGuessLocation,
    handleCurrentPanoramicImgReady,
    handleNextPanoramicImgReady,
    handleTransitionToNextRound,
    handleStartRound,
    handleMapButtonClick,
    handlePanoramaTransitionEnd,
    
    // Computed values
    disableMapButton,
    disableMapMarker,
    showAnswer,

    // Time state
    timeLeft,
  };
}
