import { locations, LocationConfig } from "./locations/chernarus/config";
import AudioPlayer from "./components/audio-player";
import GuessMap from "./components/guess-map/guess-map";
import PanoramicImg from "./components/panoramic-img";
import { ThemeUIStyleObject } from "theme-ui";
import { Box } from "theme-ui";
import { LatLngTuple } from "leaflet";
import { useState } from "react";
import MenuScreen from "./components/menu-screen";
import { calculateDistance, GAME_CONFIG, getRandomLocation } from "./utils";
import { RoundManager } from "./components/round-manager";
import { ResultsScreen } from "./components/results-screen";

const styles: Record<string, ThemeUIStyleObject> = {
  container: {
    position: "fixed",
    height: "100vh",
    width: "100%",
  },
};

export type GuessedLocation = {
  location: LatLngTuple;
  distance: number;
  locationId: string;
};

type GameState = {
  state: "menu" | "playing" | "results";
  currentRound: number;
  timeLeft: number;
  playerLocation: LatLngTuple | null;
  guessedLocations: GuessedLocation[];
  currentLocation: LocationConfig;
  hasSubmitted: boolean;
  panoramicImgReady: boolean;
};

const initialGameState: GameState = {
  state: "menu",
  currentRound: 1,
  timeLeft: 20,
  playerLocation: null,
  guessedLocations: [],
  currentLocation: getRandomLocation(locations, []), // preload first location
  hasSubmitted: false,
  panoramicImgReady: false,
};

function App() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const getCurrentRoundLocationIds = () =>
    gameState.guessedLocations.map((g) => g.locationId);

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
  };

  const handleSubmitGuess = () => {
    if (!gameState.playerLocation) return;

    const distance = calculateDistance(
      gameState.playerLocation,
      gameState.currentLocation.location
    );

    const newGuessedLocations = [
      ...gameState.guessedLocations,
      {
        location: gameState.playerLocation,
        distance,
        locationId: gameState.currentLocation.id,
      },
    ];

    setGameState((prev) => ({
      ...prev,
      hasSubmitted: true,
      guessedLocations: newGuessedLocations,
    }));
  };

  const handleNextRound = () => {
    if (gameState.currentRound >= GAME_CONFIG.ROUNDS_PER_GAME) {
      setGameState((prev) => ({ ...prev, state: "results" }));
      return;
    }

    const currentRoundLocationIds = getCurrentRoundLocationIds();
    const randomLocation = getRandomLocation(
      locations,
      currentRoundLocationIds
    );

    setGameState((prev) => ({
      ...prev,
      currentRound: prev.currentRound + 1,
      timeLeft: GAME_CONFIG.SECONDS_PER_ROUND,
      playerLocation: null,
      hasSubmitted: false,
      currentLocation: randomLocation,
      panoramicImgReady: false,
    }));
  };

  const handleTimeUp = () => {
    if (!gameState.hasSubmitted) {
      handleSubmitGuess();
    }
  };

  const handlePanoramicImgReady = () => {
    console.log("panoramic img ready");
    setGameState((prev) => ({ ...prev, panoramicImgReady: true }));
  };

  return (
    <Box sx={styles.container}>
      <MenuScreen
        visible={gameState.state === "menu"}
        onStartGame={onStartGame}
        panoramicImgReady={gameState.panoramicImgReady}
      />
      <ResultsScreen
        visible={gameState.state === "results"}
        guessedLocations={gameState.guessedLocations}
        onPlayAgain={onStartGame}
      />
      <RoundManager
        timeLeft={gameState.timeLeft}
        onTimeUpdate={handleTimeUpdate}
        onTimeUp={handleTimeUp}
        isPlaying={
          gameState.state === "playing" &&
          !gameState.hasSubmitted &&
          gameState.timeLeft > 0
        }
      />
      <GuessMap
        currentRound={gameState.currentRound}
        timeLeft={gameState.timeLeft}
        playerLocation={gameState.playerLocation}
        setPlayerLocation={setPlayerLocation}
        location={gameState.currentLocation.location}
        showAnswer={gameState.timeLeft === 0 || gameState.hasSubmitted}
        onSubmit={handleSubmitGuess}
        onNext={handleNextRound}
      />
      <PanoramicImg
        src={gameState.currentLocation.image}
        onReady={handlePanoramicImgReady}
      />
      <AudioPlayer />
    </Box>
  );
}

export default App;
