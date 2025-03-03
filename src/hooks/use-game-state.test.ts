import { renderHook, act } from '@testing-library/react';
import { useGameState } from './use-game-state';
import { LocationConfig, GameConfig } from '../types';
import { LatLngTuple } from 'leaflet';

describe('useGameState', () => {
  const mockLocationConfigs: LocationConfig[] = [
    { id: 'loc1', location: [40.7128, -74.0060], image: 'img1.jpg', panCorrection: 0 },
    { id: 'loc2', location: [34.0522, -118.2437], image: 'img2.jpg', panCorrection: 0 },
    { id: 'loc3', location: [51.5074, -0.1278], image: 'img3.jpg', panCorrection: 0 },
    { id: 'loc4', location: [48.8566, 2.3522], image: 'img4.jpg', panCorrection: 0 },
    { id: 'loc5', location: [40.7128, -74.0060], image: 'img1.jpg', panCorrection: 0 },
    { id: 'loc6', location: [34.0522, -118.2437], image: 'img2.jpg', panCorrection: 0 },
    { id: 'loc7', location: [51.5074, -0.1278], image: 'img3.jpg', panCorrection: 0 },
    { id: 'loc8', location: [48.8566, 2.3522], image: 'img4.jpg', panCorrection: 0 },
  ];

  // Create a mock game config for testing
  const mockGameConfig: GameConfig = {
    id: "chernarus",
    locations: mockLocationConfigs,
    maxRounds: 5,
    timePerRound: 30
  };

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useGameState(mockGameConfig));
    
    expect(result.current.phase).toBe('menu');
    expect(result.current.currentRound).toBe(1);
    expect(result.current.gameResults).toEqual([]);
    expect(result.current.gameLocations.length).toBe(mockGameConfig.maxRounds);
    expect(result.current.roundActive).toBe(false);
    expect(result.current.mapId).toBe("chernarus");
  });

  it('should start game correctly', () => {
    const { result } = renderHook(() => useGameState(mockGameConfig));
    
    act(() => {
      result.current.handleStartGame();
    });
    
    expect(result.current.phase).toBe('game');
    expect(result.current.roundActive).toBe(true);
    expect(result.current.guessLocation).toBe(null);
  });

  it('should handle setting a guess location', () => {
    const { result } = renderHook(() => useGameState(mockGameConfig));
    const guessLocation: LatLngTuple = [42.3601, -71.0589];
    
    act(() => {
      result.current.handleSetGuessLocation(guessLocation);
    });
    
    expect(result.current.guessLocation).toEqual(guessLocation);
  });

  it('should transition to next round correctly', () => {
    const { result } = renderHook(() => useGameState(mockGameConfig));
    
    // Start game, make a guess, end round
    act(() => {
      result.current.handleStartGame();
      result.current.handleSetGuessLocation([42.3601, -71.0589]);
      result.current.handleRoundEnd();
    });
    
    // Transition to next round
    act(() => {
      result.current.handleTransitionToNextRound();
    });
    
    expect(result.current.isTransitioningRound).toBe(true);
    
    // Complete transition
    act(() => {
      result.current.handlePanoramaTransitionEnd();
    });
    
    expect(result.current.currentRound).toBe(2);
    expect(result.current.roundActive).toBe(true);
    expect(result.current.isTransitioningRound).toBe(false);
  });

  it('should end game after all rounds are completed', () => {
    const { result } = renderHook(() => useGameState(mockGameConfig));
    
    act(() => {
      result.current.handleStartGame();
    });
    
    // Complete all rounds
    for (let i = 0; i < mockGameConfig.maxRounds; i++) {
      act(() => {
        result.current.handleSetGuessLocation([42.3601, -71.0589]);
        result.current.handleRoundEnd();
      });
      
      if (i < mockGameConfig.maxRounds - 1) {
        act(() => {
          result.current.handleTransitionToNextRound();
          result.current.handlePanoramaTransitionEnd();
        });
      }
    }
    
    act(() => {
      result.current.handleGameEnd();
    });
    
    expect(result.current.phase).toBe('results');
    expect(result.current.gameResults.length).toBe(mockGameConfig.maxRounds);
    expect(result.current.currentRound).toBe(1); 
    expect(result.current.gameCount).toBe(1);
  });
});
