import { GameStateType } from "../types";

type Props = {
    state: GameStateType,
}

export const useShowAnswer = ({ state }: Props): boolean => {
    return (
        state.phase === "game" &&
        !state.roundActive &&
        !state.isTransitioningRound
        );
}
