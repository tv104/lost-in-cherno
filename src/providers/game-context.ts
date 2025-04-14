import { createContext } from "react";
import { GameContextType } from "./game-provider";

export const GameContext = createContext<GameContextType | null>(null);
