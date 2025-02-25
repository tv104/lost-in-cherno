import { panoramas as allPanoramas } from "./locations/chernarus/config";
import AudioPlayer from "./components/audio-player";
import { GuessMap } from "./components/guess-map";
import { PanoramaViewer } from "./components/panorama-viewer";
import { ThemeUIStyleObject, Box } from "theme-ui";
import {
  RoundResultMessage,
  ResultsScreen,
  MenuScreen,
} from "./components/overlays";
import { useGameState } from "./hooks";

const styles: Record<string, ThemeUIStyleObject> = {
  container: {
    position: "fixed",
    height: "100vh",
    width: "100%",
  },
};

function App() {
  const {
    // State
    currentRound,
    gameResults,
    phase,
    panoramas,
    gameCount,
    guessLocation,
    roundActive,
    firstRoundReady,
    isTransitioningRound,
    timeLeft,
    showAnswer,

    // Handlers
    handleSetGuessLocation,
    handleCurrentPanoramicImgReady,
    handleNextPanoramicImgReady,
    handleMapButtonClick,
    handlePanoramaTransitionEnd,
    handleStartGame,

    // Computed values
    disableMapButton,
    disableMapMarker,
  } = useGameState(allPanoramas);

  return (
    <Box sx={styles.container}>
      {phase === "menu" && (
        <MenuScreen
          disableStartButton={!firstRoundReady}
          onStartGame={handleStartGame}
        />
      )}
      {phase === "results" && (
        <ResultsScreen
          disableStartButton={!firstRoundReady}
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
