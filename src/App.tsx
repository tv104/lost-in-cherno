import { panoramas } from "./locations/chernarus/config";
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
  getAvailablePanorama,
  saveRoundLocation,
  assertNotNull,
  type PanoramaConfig,
  type RoundResult,
} from "./utils";
import { ResultsScreen } from "./components/results-screen";

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
  currentPanorama: PanoramaConfig;
  nextPanorama: PanoramaConfig | null;
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
  currentPanorama: getAvailablePanorama(panoramas, []),
  nextPanorama: null,
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

  const { currentRound, gameResults, phase, currentPanorama, nextPanorama } =
    gameState;
  const {
    guessLocation,
    roundActive,
    timeLeft,
    currentRoundReady,
    nextRoundReady,
    isTransitioningRound,
  } = roundState;

  const handleStartGame = () => {
    setGameState(
      (prev): GameState => ({
        ...prev,
        phase: "game",
        gameResults: [],
        nextPanorama: getAvailablePanorama(panoramas, [currentPanorama.id]),
      })
    );

    setRoundState(
      (): RoundState => ({
        ...initialRoundState,
        roundActive: true,
        isTransitioningRound: false,
      })
    );
  };

  const handleGameEnd = () => {
    setRoundState((): RoundState => initialRoundState);
    setGameState(
      (prev): GameState => ({
        ...initialGameState,
        currentPanorama: getAvailablePanorama(panoramas, [
          prev.currentPanorama.id,
        ]),
        gameResults: prev.gameResults,
        phase: "results",
      })
    );
  };

  const handleSetGuessLocation = (location: LatLngTuple) => {
    setRoundState((prev): RoundState => ({ ...prev, guessLocation: location }));
  };

  const handleMapButtonClick = () => {
    if (roundActive && guessLocation) {
      handleRoundEnd();
    } else if (!roundActive) {
      if (currentRound >= GAME_CONFIG.ROUNDS_PER_GAME) {
        handleGameEnd();
      } else {
        handleTransitionToNextRound();
      }
    }
  };

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

  const handleTransitionToNextRound = () => {
    setGameState(
      (prev): GameState => ({
        ...prev,
        currentRound: prev.currentRound + 1,
      })
    );

    setRoundState(
      (): RoundState => ({
        ...initialRoundState,
        isTransitioningRound: true,
      })
    );
  };

  const handleStartRound = () => {
    assertNotNull(nextPanorama, "nextPanorama");
    const newCurrentPanorama = nextPanorama;
    const newNextPanorama = getAvailablePanorama(panoramas, [
      newCurrentPanorama.id,
    ]);

    setGameState(
      (prev): GameState => ({
        ...prev,
        currentPanorama: newCurrentPanorama,
        nextPanorama: newNextPanorama,
      })
    );

    setRoundState(
      (): RoundState => ({
        ...initialRoundState,
        roundActive: true,
        isTransitioningRound: false,
      })
    );
  };

  const handleRoundEnd = useCallback(() => {
    const distance = guessLocation
      ? calculateDistance(guessLocation, currentPanorama.location)
      : null;

    const updatedGameResults: RoundResult[] = [
      ...gameResults,
      {
        locationId: currentPanorama.id,
        distance,
        timeLeft: timeLeft,
      },
    ];

    saveRoundLocation(currentPanorama.id);
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
  }, [currentPanorama, gameResults, guessLocation, timeLeft]);

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
            roundActive: newTimeLeft > 0,
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
    return (
      (timeLeft > 0 && !guessLocation) || (!roundActive && !nextRoundReady)
    );
  }, [timeLeft, guessLocation, roundActive, nextRoundReady]);

  const disableMapMarker = useMemo(() => {
    return phase !== "game" || (!roundActive && !isTransitioningRound);
  }, [phase, roundActive, isTransitioningRound]);

  const handlePanoramaTransitionEnd = () => {
    if (isTransitioningRound) {
      handleStartRound();
    }
  };

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
        panoramaLocation={currentPanorama.location}
        showAnswer={phase === "game" && !roundActive && !isTransitioningRound}
        onMapButtonClick={handleMapButtonClick}
        mapButtonDisabled={disableMapButton}
        mapMarkerDisabled={disableMapMarker}
        isTransitioningRound={isTransitioningRound}
      />
      <PanoramaViewer
        src={currentPanorama.image}
        preloadSrc={nextPanorama?.image || ""}
        onCurrentReady={handleCurrentPanoramicImgReady}
        onNextReady={handleNextPanoramicImgReady}
        roundActive={roundActive}
        isTransitioningRound={isTransitioningRound}
        onTransitionEnd={handlePanoramaTransitionEnd}
      />
      <AudioPlayer />
    </Box>
  );
}

export default App;
