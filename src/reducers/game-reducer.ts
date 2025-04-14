import { LatLngTuple } from "leaflet";
import { GameStateType as GameState } from "../types";

export type GameAction =
    | { type: "START_GAME", payload?: never }
    | {
        type: "END_GAME", payload: {
            newGameLocations: GameState['gameLocations'],
            gameCount: number,
        }
    }
    | { type: "START_ROUND", payload: { currentRound: number } }
    | {
        type: "END_ROUND", payload: {
            locationId: string,
            distance: number | null,
            timeLeft: number,
        }
    }
    | { type: "TRANSITION_ROUND", payload?: never }
    | { type: "NEXT_IMG_READY", payload?: never }
    | { type: "CURRENT_IMG_READY", payload?: never }
    | { type: "SET_GUESS_LOCATION", payload: { location: LatLngTuple } }

export function gameReducer(state: GameState, action: GameAction): GameState {
    const { type, payload } = action
    switch (type) {
        case "START_GAME":
            return {
                ...state,
                phase: 'game',
                gameResults: [],
                roundActive: true,
            }
        case "END_GAME":
            return {
                ...state,
                phase: 'results',
                guessLocation: null,
                roundActive: false,
                // prepare state for next game
                gameCount: payload.gameCount + 1,
                currentRound: 1,
                gameLocations: payload.newGameLocations,
                firstRoundReady: false,
                nextRoundReady: false,
                isTransitioningRound: false,
            }
        case "START_ROUND":
            return {
                ...state,
                currentRound: payload.currentRound + 1,
                roundActive: true,
                nextRoundReady: false,
                isTransitioningRound: false,
            }
        case "END_ROUND":
            return {
                ...state,
                roundActive: false,
                gameResults: [
                    ...state.gameResults,
                    {
                        locationId: payload.locationId,
                        distance: payload.distance,
                        timeLeft: payload.timeLeft,
                    },
                ],
            }
        case "TRANSITION_ROUND":
            return {
                ...state,
                guessLocation: null,
                isTransitioningRound: true,
            }
        case "NEXT_IMG_READY":
            return {
                ...state,
                nextRoundReady: true,
            }
        case "CURRENT_IMG_READY":
            return {
                ...state,
                firstRoundReady: true,
            }
        case "SET_GUESS_LOCATION":
            return {
                ...state,
                guessLocation: payload.location
            }
        default: {
            // ensure all action types are handled
            const exhaustiveCheck: never = action
            return exhaustiveCheck
        }
    }
}