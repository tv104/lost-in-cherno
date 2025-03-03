import { createContext, useContext, ReactNode } from "react";
import { useGameState } from "../hooks";
import { GameStateContextType } from "../types";
import { GameConfig } from "../types/game-config";

const GameStateContext = createContext<GameStateContextType | undefined>(
  undefined
);

export function GameStateProvider({
  children,
  gameConfig,
}: {
  children: ReactNode;
  gameConfig: GameConfig;
}) {
  const gameState = useGameState(gameConfig);

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
