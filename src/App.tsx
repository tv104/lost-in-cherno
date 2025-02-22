import {
  locations,
  ScreenshotLocationConfig,
} from "./locations/chernarus/config";
import AudioPlayer from "./components/audio-player";
import { GuessMap } from "./components/guess-map/guess-map";
import { PanoramicImg } from "./components/panoramic-img";
import { ThemeUIStyleObject } from "theme-ui";
import { Box } from "theme-ui";
import { LatLngTuple } from "leaflet";
import { useState } from "react";
import { MenuScreen } from "./components/menu-screen";
import {
  calculateDistance,
  GAME_CONFIG,
  getRandomLocation,
  saveRoundLocation,
} from "./utils";
import { RoundManager } from "./components/round-manager";
import { ResultsScreen } from "./components/results-screen";

const styles: Record<string, ThemeUIStyleObject> = {
  container: {
    position: "fixed",
    height: "100vh",
    width: "100%",
  },
};

export type RoundResult = {
  locationId: string;
  distance: number | null;
};

type GameState = {
  state: "menu" | "playing" | "results";
  currentRound: number;
  timeLeft: number;
  playerLocation: LatLngTuple | null;
  gameResults: RoundResult[];
  screenshotLocation: ScreenshotLocationConfig;
  roundEnded: boolean;
  panoramicImgReady: boolean;
};

const initialGameState: GameState = {
  state: "menu",
  currentRound: 1,
  timeLeft: GAME_CONFIG.SECONDS_PER_ROUND,
  playerLocation: null,
  gameResults: [],
  screenshotLocation: getRandomLocation(locations, []),
  roundEnded: false,
  panoramicImgReady: false,
};

function App() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const getcurrentGameLocationIds = () =>
    gameState.gameResults.map((r) => r.locationId);

  const setPlayerLocation = (location: LatLngTuple) => {
    setGameState({ ...gameState, playerLocation: location });
  };

  const onStartGame = () => {
    setGameState({
      ...initialGameState,
      state: "playing",
    });
  };

  const handleTimeUpdate = (time: number) => {
    setGameState((prev) => ({ ...prev, timeLeft: time }));
    if (time === 0) {
      handleRoundEnd();
    }
  };

  const handleRoundEnd = () => {
    const distance = gameState.playerLocation
      ? calculateDistance(
          gameState.playerLocation,
          gameState.screenshotLocation.location
        )
      : null;

    const updatedGameResults: RoundResult[] = [
      ...gameState.gameResults,
      {
        locationId: gameState.screenshotLocation.id,
        distance,
      },
    ];

    saveRoundLocation(gameState.screenshotLocation.id);
    setGameState((prev) => ({
      ...prev,
      roundEnded: true,
      gameResults: updatedGameResults,
    }));
  };

  const handleNextRound = () => {
    if (gameState.currentRound >= GAME_CONFIG.ROUNDS_PER_GAME) {
      setGameState((prev) => ({ ...prev, state: "results" }));
      return;
    }

    const currentGameLocationIds = getcurrentGameLocationIds();
    const randomLocation = getRandomLocation(locations, currentGameLocationIds);

    setGameState((prev) => ({
      ...prev,
      currentRound: prev.currentRound + 1,
      timeLeft: GAME_CONFIG.SECONDS_PER_ROUND,
      playerLocation: null,
      roundEnded: false,
      screenshotLocation: randomLocation,
      panoramicImgReady: false,
    }));
  };

  const handlePanoramicImgReady = () => {
    console.log("panoramic img ready");
    setGameState((prev) => ({ ...prev, panoramicImgReady: true }));
  };

  const handleSubmit = () => {
    if (gameState.timeLeft > 0 && gameState.playerLocation) {
      handleRoundEnd();
    }
  };

  return (
    <Box sx={styles.container}>
      {gameState.state === "menu" && (
        <MenuScreen
          onStartGame={onStartGame}
          panoramicImgReady={gameState.panoramicImgReady}
        />
      )}
      {gameState.state === "results" && (
        <ResultsScreen
          gameResults={gameState.gameResults}
          onPlayAgain={onStartGame}
        />
      )}
      <RoundManager
        timeLeft={gameState.timeLeft}
        onTimeUpdate={handleTimeUpdate}
        isPlaying={
          gameState.state === "playing" &&
          !gameState.roundEnded &&
          gameState.timeLeft > 0
        }
      />
      <GuessMap
        currentRound={gameState.currentRound}
        timeLeft={gameState.timeLeft}
        playerLocation={gameState.playerLocation}
        setPlayerLocation={setPlayerLocation}
        location={gameState.screenshotLocation.location}
        showAnswer={gameState.timeLeft === 0 || gameState.roundEnded}
        onSubmit={handleSubmit}
        onNext={handleNextRound}
        isPlaying={gameState.state === "playing"}
      />
      <PanoramicImg
        src={gameState.screenshotLocation.image}
        onReady={handlePanoramicImgReady}
      />
      <AudioPlayer />
    </Box>
  );
}

export default App;
