import { createContext, useContext, ReactNode } from "react";
import { useGameState } from "../hooks";
import { LocationConfig } from "../types";
import { GameStateContextType } from "../types";

const GameStateContext = createContext<GameStateContextType | undefined>(
  undefined
);

export function GameStateProvider({
  children,
  locationConfigs,
}: {
  children: ReactNode;
  locationConfigs: LocationConfig[];
}) {
  const gameState = useGameState(locationConfigs);

  return (
    <GameStateContext.Provider value={gameState}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameStateContext() {
  const context = useContext(GameStateContext);

  if (context === undefined) {
    throw new Error(
      "useGameStateContext must be used within a GameStateProvider"
    );
  }

  return context;
}
