import { AudioPlayer } from "./components/audio-player";
import { GuessMap } from "./components/guess-map";
import { PanoramaViewer } from "./components/panorama-viewer";
import {
  RoundResultMessage,
  ResultsScreen,
  MenuScreen,
} from "./components/overlays";
import { useGameState } from "./hooks";

function App() {
  const { state } = useGameState();

  return (
    <div className="fixed h-screen w-full">
      {state.phase === "menu" && <MenuScreen />}
      {state.phase === "results" && <ResultsScreen />}
      <GuessMap />
      <PanoramaViewer />
      <RoundResultMessage />
      <AudioPlayer />
    </div>
  );
}

export default App;
