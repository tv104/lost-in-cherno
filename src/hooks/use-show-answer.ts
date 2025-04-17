import { GameState } from "../types";

type Props = {
    state: GameState,
}

export const useShowAnswer = ({ state }: Props): boolean => {
    return (
        state.phase === "game" &&
        !state.roundActive &&
        !state.isTransitioningRound
        );
}
