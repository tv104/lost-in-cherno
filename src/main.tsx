import { locationConfigs as chernarusLocationConfigs } from "./config/chernarus/locations";
import { mapLabels as chernarusMapLabels } from "./config/chernarus/map-labels";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeUIProvider } from "theme-ui";
import { theme } from "./theme/theme.ts";
import "leaflet/dist/leaflet.css";
import { GameConfig } from "./types";
import { GameProvider } from "./providers/game-provider.tsx";

const chernarusGameConfig: GameConfig = {
  id: "chernarus",
  locations: chernarusLocationConfigs,
  mapLabels: chernarusMapLabels,
  maxRounds: 5,
  timePerRound: 30,
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GameProvider gameConfig={chernarusGameConfig}>
      <ThemeUIProvider theme={theme}>
        <App />
      </ThemeUIProvider>
    </GameProvider>
  </StrictMode>
);
