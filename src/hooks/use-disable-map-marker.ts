import { GameState } from "../types"

type Props = {
    state: GameState,
}

export const useDisableMapMarker = ({ state }: Props): boolean => {
    return state.phase !== "game" || !state.roundActive || state.isTransitioningRound
}
