import { locationConfigs as chernarusLocationConfigs } from "./config/chernarus/locations";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeUIProvider } from "theme-ui";
import { theme } from "./theme/theme.ts";
import "leaflet/dist/leaflet.css";
import { GameStateProvider } from "./contexts/game-state-context.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GameStateProvider locationConfigs={chernarusLocationConfigs}>
      <ThemeUIProvider theme={theme}>
        <App />
      </ThemeUIProvider>
    </GameStateProvider>
  </StrictMode>
);
