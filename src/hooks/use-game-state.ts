import { useState, useCallback, useMemo, useEffect } from 'react';
import { LatLngTuple } from 'leaflet';
import { 
  calculateDistance, 
  saveRoundLocation,
  getNewGameLocations,
} from '../utils';
import { useRoundTimer } from './use-round-timer';
import { GameStateType, GameStateContextType, RoundResult, LocationConfig } from '../types';
import { GAME_CONFIG } from '../config';

const createInitialState = (allPanoramas: LocationConfig[]): GameStateType => ({
  currentRound: 1,
  gameResults: [],
  phase: 'menu',
  gameLocations: getNewGameLocations(allPanoramas, GAME_CONFIG.ROUNDS_PER_GAME),
  gameCount: 0,
  
  guessLocation: null,
  roundActive: false,
  firstRoundReady: false,
  nextRoundReady: false,
  isTransitioningRound: false,
});

export function useGameState(allPanoramas: LocationConfig[]): GameStateContextType {
  const [state, setState] = useState<GameStateType>(() => 
    createInitialState(allPanoramas)
  );
  
  const { 
    currentRound, gameResults, phase, gameLocations, gameCount,
    guessLocation, roundActive, isTransitioningRound
  } = state;

  const { timeLeft, resetTimer } = useRoundTimer({
    initialTime: GAME_CONFIG.SECONDS_PER_ROUND,
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
      guessLocation: null,
      nextRoundReady: false,
      isTransitioningRound: false
    });
  }, [updateState]);

  const handleGameEnd = useCallback(() => {
    const newLocations = getNewGameLocations(
      allPanoramas,
      GAME_CONFIG.ROUNDS_PER_GAME
    );
    
    updateState({
      currentRound: 1,
      phase: 'results',
      gameLocations: newLocations,
      gameCount: gameCount + 1,
      guessLocation: null,
      roundActive: false,
      firstRoundReady: false,
      nextRoundReady: false,
      isTransitioningRound: false
    });
  }, [allPanoramas, gameCount, updateState]);

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
      roundActive: false,
      firstRoundReady: false,
      nextRoundReady: false,
      isTransitioningRound: true
    });
  }, [updateState]);

  const handleStartRound = useCallback(() => {
    updateState({
      currentRound: currentRound + 1,
      guessLocation: null,
      roundActive: true,
      firstRoundReady: false,
      nextRoundReady: false,
      isTransitioningRound: false
    });
    
    resetTimer();
  }, [currentRound, resetTimer, updateState]);

  const [mapButtonDisabled, setMapButtonDisabled] = useState(false);

  const handleMapButtonClick = useCallback(() => {
    if (mapButtonDisabled) return;

    setMapButtonDisabled(true);

    if (roundActive && guessLocation) {
      handleRoundEnd();
    } else if (!roundActive) {
      if (currentRound >= GAME_CONFIG.ROUNDS_PER_GAME) {
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
    handleTransitionToNextRound
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
