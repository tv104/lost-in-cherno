import { GameStateType } from "../types"

type Props = {
    state: GameStateType,
}

export const useDisableMapMarker = ({ state }: Props): boolean => {
    return state.phase !== "game" || !state.roundActive || state.isTransitioningRound
}
