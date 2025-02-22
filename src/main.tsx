import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeUIProvider } from "theme-ui";
import { theme } from "./theme/theme.ts";
import "leaflet/dist/leaflet.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeUIProvider theme={theme}>
      <App />
    </ThemeUIProvider>
  </StrictMode>
);
