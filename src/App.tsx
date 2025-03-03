import { AudioPlayer } from "./components/audio-player";
import { GuessMap } from "./components/guess-map";
import { PanoramaViewer } from "./components/panorama-viewer";
import { ThemeUIStyleObject, Box } from "theme-ui";
import {
  RoundResultMessage,
  ResultsScreen,
  MenuScreen,
} from "./components/overlays";
import { useGameStateContext } from "./contexts";

const styles: Record<string, ThemeUIStyleObject> = {
  container: {
    position: "fixed",
    height: "100vh",
    width: "100%",
  },
};

function App() {
  const { phase } = useGameStateContext();
  return (
    <Box sx={styles.container}>
      {phase === "menu" && <MenuScreen />}
      {phase === "results" && <ResultsScreen />}
      <GuessMap />
      <PanoramaViewer />
      <RoundResultMessage />
      <AudioPlayer />
    </Box>
  );
}

export default App;
