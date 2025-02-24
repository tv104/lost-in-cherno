import { panoramas as allPanoramas } from "./locations/chernarus/config";
import AudioPlayer from "./components/audio-player";
import { GuessMap } from "./components/guess-map/guess-map";
import { PanoramaViewer } from "./components/panorama-viewer";
import { ThemeUIStyleObject } from "theme-ui";
import { Box } from "theme-ui";
import { LatLngTuple } from "leaflet";
import { useState, useEffect, useMemo, useCallback } from "react";
import { MenuScreen } from "./components/menu-screen";
import {
  calculateDistance,
  GAME_CONFIG,
  saveRoundLocation,
  type PanoramaConfig,
  type RoundResult,
  getPanoramasForNewGame,
} from "./utils";
import { ResultsScreen } from "./components/results-screen";
import { RoundResultMessage } from "./components/round-result-message";

const styles: Record<string, ThemeUIStyleObject> = {
  container: {
    position: "fixed",
    height: "100vh",
    width: "100%",
  },
};

// updates every round
type GameState = {
  currentRound: number;
  gameResults: RoundResult[];
  phase: "menu" | "game" | "results";
  panoramas: PanoramaConfig[];
  gameCount: number;
};

// updates within a round
type RoundState = {
  guessLocation: LatLngTuple | null;
  roundActive: boolean;
  timeLeft: number;
  currentRoundReady: boolean;
  nextRoundReady: boolean;
  isTransitioningRound: boolean;
};

const initialGameState: GameState = {
  currentRound: 1,
  gameResults: [],
  phase: "menu",
  panoramas: getPanoramasForNewGame(allPanoramas, GAME_CONFIG.ROUNDS_PER_GAME),
  gameCount: 0,
};

const initialRoundState: RoundState = {
  guessLocation: null,
  roundActive: false,
  timeLeft: GAME_CONFIG.SECONDS_PER_ROUND,
  currentRoundReady: false,
  nextRoundReady: false,
  isTransitioningRound: false,
};

function App() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [roundState, setRoundState] = useState<RoundState>(initialRoundState);
  const [isButtonCooldown, setIsButtonCooldown] = useState(false);

  const { currentRound, gameResults, phase, panoramas, gameCount } = gameState;
  const {
    guessLocation,
    roundActive,
    timeLeft,
    currentRoundReady,
    // nextRoundReady,
    isTransitioningRound,
  } = roundState;

  const handleStartGame = useCallback(() => {
    setGameState(
      (prev): GameState => ({
        ...prev,
        phase: "game",
        gameResults: [],
      })
    );

    setRoundState(
      (): RoundState => ({
        ...initialRoundState,
        roundActive: true,
        isTransitioningRound: false,
      })
    );
  }, []);

  const handleGameEnd = useCallback(() => {
    setRoundState((): RoundState => initialRoundState);
    setGameState(
      (prev): GameState => ({
        ...initialGameState,
        panoramas: getPanoramasForNewGame(
          allPanoramas,
          GAME_CONFIG.ROUNDS_PER_GAME
        ),
        gameResults: prev.gameResults,
        phase: "results",
        gameCount: prev.gameCount + 1,
      })
    );
  }, []);

  const handleSetGuessLocation = useCallback((location: LatLngTuple) => {
    setRoundState((prev): RoundState => ({ ...prev, guessLocation: location }));
  }, []);

  const handleCurrentPanoramicImgReady = () => {
    if (phase === "menu" || phase === "results") {
      setRoundState(
        (prev): RoundState => ({ ...prev, currentRoundReady: true })
      );
    }
  };

  const handleNextPanoramicImgReady = () => {
    setRoundState((prev): RoundState => ({ ...prev, nextRoundReady: true }));
  };

  const handleTransitionToNextRound = useCallback(() => {
    setRoundState(
      (): RoundState => ({
        ...initialRoundState,
        isTransitioningRound: true,
      })
    );
  }, []);

  const handleStartRound = useCallback(() => {
    setGameState(
      (prev): GameState => ({
        ...prev,
        currentRound: prev.currentRound + 1,
      })
    );

    setRoundState(
      (): RoundState => ({
        ...initialRoundState,
        roundActive: true,
        isTransitioningRound: false,
      })
    );
  }, []);

  const handleRoundEnd = useCallback(() => {
    const distance = guessLocation
      ? calculateDistance(guessLocation, panoramas[currentRound - 1].location)
      : null;

    const updatedGameResults: RoundResult[] = [
      ...gameResults,
      {
        locationId: panoramas[currentRound - 1].id,
        distance,
        timeLeft: timeLeft,
      },
    ];

    saveRoundLocation(panoramas[currentRound - 1].id);
    setGameState(
      (prev): GameState => ({
        ...prev,
        gameResults: updatedGameResults,
      })
    );
    setRoundState(
      (prev): RoundState => ({
        ...prev,
        roundActive: false,
      })
    );
  }, [panoramas, currentRound, gameResults, guessLocation, timeLeft]);

  const handleMapButtonClick = useCallback(() => {
    if (isButtonCooldown) return;

    setIsButtonCooldown(true);

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
      setIsButtonCooldown(false);
    }, 500);
  }, [
    roundActive,
    guessLocation,
    handleRoundEnd,
    currentRound,
    handleGameEnd,
    handleTransitionToNextRound,
    isButtonCooldown,
  ]);

  // Round timer
  useEffect(() => {
    if (!roundActive) return;

    let animationFrameId: number;
    const startTime = performance.now();
    const initialTimeLeft = timeLeft;
    let lastUpdateTime = startTime;

    const updateTimer = (currentTime: number) => {
      const safeCurrentTime = Math.max(currentTime, lastUpdateTime);
      const elapsedTime = (safeCurrentTime - startTime) / 1000;
      const newTimeLeft = Math.max(0, initialTimeLeft - elapsedTime);

      // Update state if enough time has passed (10ms) or if timer reached 0
      if (safeCurrentTime - lastUpdateTime >= 10 || newTimeLeft <= 0) {
        lastUpdateTime = safeCurrentTime;
        setRoundState(
          (prev): RoundState => ({
            ...prev,
            timeLeft: newTimeLeft,
          })
        );

        if (newTimeLeft <= 0) {
          handleRoundEnd();
          return;
        }
      }

      animationFrameId = requestAnimationFrame(updateTimer);
    };

    animationFrameId = requestAnimationFrame(updateTimer);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [handleRoundEnd, roundActive, timeLeft]);

  const disableMapButton = useMemo(() => {
    if (isButtonCooldown) return true;

    return timeLeft > 0 && !guessLocation;
  }, [isButtonCooldown, timeLeft, guessLocation]);

  const disableMapMarker = useMemo(() => {
    return phase !== "game" || !roundActive || isTransitioningRound;
  }, [phase, roundActive, isTransitioningRound]);

  const handlePanoramaTransitionEnd = () => {
    if (isTransitioningRound) {
      handleStartRound();
    }
  };

  const showAnswer = useMemo(() => {
    return phase === "game" && !roundActive && !isTransitioningRound;
  }, [phase, roundActive, isTransitioningRound]);

  // Add effect to handle answer reveal cooldown
  useEffect(() => {
    if (showAnswer) {
      setIsButtonCooldown(true);
      const timeout = setTimeout(() => {
        setIsButtonCooldown(false);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [showAnswer]);

  return (
    <Box sx={styles.container}>
      {phase === "menu" && (
        <MenuScreen
          disableStartButton={!currentRoundReady}
          onStartGame={handleStartGame}
        />
      )}
      {phase === "results" && (
        <ResultsScreen
          disableStartButton={!currentRoundReady}
          gameResults={gameResults}
          onStartGame={handleStartGame}
        />
      )}
      <GuessMap
        currentRound={currentRound}
        timeLeft={timeLeft}
        guessLocation={guessLocation}
        setGuessLocation={handleSetGuessLocation}
        panoramaLocation={panoramas[currentRound - 1].location}
        showAnswer={showAnswer}
        onMapButtonClick={handleMapButtonClick}
        mapButtonDisabled={disableMapButton}
        mapMarkerDisabled={disableMapMarker}
        isTransitioningRound={isTransitioningRound}
        gameCount={gameCount}
      />
      <PanoramaViewer
        src={panoramas[currentRound - 1].image}
        preloadSrc={panoramas[currentRound]?.image}
        onCurrentReady={handleCurrentPanoramicImgReady}
        onNextReady={handleNextPanoramicImgReady}
        roundActive={roundActive}
        isTransitioningRound={isTransitioningRound}
        onTransitionEnd={handlePanoramaTransitionEnd}
        gameCount={gameCount}
      />
      {showAnswer && (
        <RoundResultMessage
          guessLocation={guessLocation}
          panoramaLocation={panoramas[currentRound - 1].location}
        />
      )}
      <AudioPlayer />
    </Box>
  );
}

export default App;
