import { GameConfig, GameStateType as GameState } from "../types";
import { useReducer } from "react";
import { getNewGameLocations } from "../utils";
import { GameAction, gameReducer } from "../reducers/game-reducer";
import { GameContext } from "./game-context";

interface Props extends React.PropsWithChildren {
  gameConfig: GameConfig;
}

export type GameContextType = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
};

export function GameProvider({ children, gameConfig }: Props) {
  const initialState: GameState = {
    allLocations: gameConfig.locations,
    currentRound: 1,
    gameResults: [],
    phase: "menu",
    gameLocations: getNewGameLocations(
      gameConfig.locations,
      gameConfig.maxRounds
    ),
    gameCount: 0,
    mapId: gameConfig.id,
    maxRounds: gameConfig.maxRounds,
    maxTimePerRound: gameConfig.timePerRound,
    mapLabels: gameConfig.mapLabels,

    guessLocation: null,
    roundActive: false,
    firstRoundReady: false,
    nextRoundReady: false,
    isTransitioningRound: false,
  };

  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}
