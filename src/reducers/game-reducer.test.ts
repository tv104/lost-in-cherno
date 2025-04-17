import { LatLngTuple } from "leaflet";
import { GameState, GamePhase } from "../types";
import { gameReducer } from "./game-reducer";

describe("gameReducer", () => {
    const mockInitialState: GameState = {
        allLocations: [],
        currentRound: 1,
        gameResults: [],
        phase: "menu" as GamePhase,
        gameLocations: [],
        gameCount: 0,
        mapId: "chernarus",
        maxRounds: 5,
        maxTimePerRound: 60,
        mapLabels: [],
        guessLocation: null,
        roundActive: false,
        firstRoundReady: false,
        nextRoundReady: false,
        isTransitioningRound: false,
    };

    describe("START_GAME", () => {
        it("should start a fresh game from menu phase", () => {
            const state = {
                ...mockInitialState,
                phase: "menu" as GamePhase,
                gameResults: [{ locationId: "1", distance: 100, timeLeft: 30 }],
                roundActive: false,
            };

            const newState = gameReducer(state, { type: "START_GAME" });

            expect(newState.phase).toBe("game");
            expect(newState.gameResults).toEqual([]);
            expect(newState.roundActive).toBe(true);
            expect(newState.currentRound).toBe(state.currentRound);
            expect(newState.gameCount).toBe(state.gameCount);
            expect(newState.firstRoundReady).toBe(state.firstRoundReady);
            expect(newState.nextRoundReady).toBe(state.nextRoundReady);
            expect(newState.isTransitioningRound).toBe(state.isTransitioningRound);
        });

        it("should start a new game from results phase", () => {
            const state = {
                ...mockInitialState,
                phase: "results" as GamePhase,
                gameResults: [{ locationId: "1", distance: 100, timeLeft: 30 }],
                roundActive: false,
                currentRound: 5,
                gameCount: 1,
            };

            const newState = gameReducer(state, { type: "START_GAME" });

            expect(newState.phase).toBe("game");
            expect(newState.gameResults).toEqual([]);
            expect(newState.roundActive).toBe(true);
            expect(newState.currentRound).toBe(state.currentRound);
            expect(newState.gameCount).toBe(state.gameCount);
            expect(newState.firstRoundReady).toBe(state.firstRoundReady);
            expect(newState.nextRoundReady).toBe(state.nextRoundReady);
            expect(newState.isTransitioningRound).toBe(state.isTransitioningRound);
        });
    });

    describe("END_GAME", () => {
        it("should transition to results phase and prepare for next game", () => {
            const newGameLocations = [{ id: "1", image: "test.jpg", location: [0, 0] as LatLngTuple, panCorrection: 0 }];
            const state = {
                ...mockInitialState,
                phase: "game" as GamePhase,
                guessLocation: [1, 1] as LatLngTuple,
                roundActive: true,
                gameCount: 0,
                currentRound: 5,
                firstRoundReady: true,
                nextRoundReady: true,
                isTransitioningRound: true,
            };

            const newState = gameReducer(state, {
                type: "END_GAME",
                payload: { newGameLocations, gameCount: 0 }
            });

            expect(newState.phase).toBe("results");
            expect(newState.guessLocation).toBeNull();
            expect(newState.roundActive).toBe(false);
            expect(newState.gameCount).toBe(1);
            expect(newState.currentRound).toBe(1);
            expect(newState.gameLocations).toEqual(newGameLocations);
            expect(newState.firstRoundReady).toBe(false);
            expect(newState.nextRoundReady).toBe(false);
            expect(newState.isTransitioningRound).toBe(false);
        });
    });

    describe("START_ROUND", () => {
        it("should increment round and activate it", () => {
            const state = {
                ...mockInitialState,
                currentRound: 1,
                roundActive: false,
                nextRoundReady: true,
                isTransitioningRound: true,
            };

            const newState = gameReducer(state, {
                type: "START_ROUND",
                payload: { currentRound: 1 }
            });

            expect(newState.currentRound).toBe(2);
            expect(newState.roundActive).toBe(true);
            expect(newState.nextRoundReady).toBe(false);
            expect(newState.isTransitioningRound).toBe(false);
        });
    });

    describe("END_ROUND", () => {
        it("should add result and deactivate round", () => {
            const state = {
                ...mockInitialState,
                roundActive: true,
                gameResults: [],
            };

            const newState = gameReducer(state, {
                type: "END_ROUND",
                payload: {
                    locationId: "1",
                    distance: 100,
                    timeLeft: 30,
                }
            });

            expect(newState.roundActive).toBe(false);
            expect(newState.gameResults).toEqual([{
                locationId: "1",
                distance: 100,
                timeLeft: 30,
            }]);
        });
    });

    describe("TRANSITION_ROUND", () => {
        it("should clear guess location and set transition flag", () => {
            const state = {
                ...mockInitialState,
                guessLocation: [1, 1] as LatLngTuple,
                isTransitioningRound: false,
            };

            const newState = gameReducer(state, { type: "TRANSITION_ROUND" });

            expect(newState.guessLocation).toBeNull();
            expect(newState.isTransitioningRound).toBe(true);
        });
    });

    describe("NEXT_IMG_READY", () => {
        it("should set next round ready flag", () => {
            const state = {
                ...mockInitialState,
                nextRoundReady: false,
            };

            const newState = gameReducer(state, { type: "NEXT_IMG_READY" });

            expect(newState.nextRoundReady).toBe(true);
        });
    });

    describe("CURRENT_IMG_READY", () => {
        it("should set first round ready flag", () => {
            const state = {
                ...mockInitialState,
                firstRoundReady: false,
            };

            const newState = gameReducer(state, { type: "CURRENT_IMG_READY" });

            expect(newState.firstRoundReady).toBe(true);
        });
    });

    describe("SET_GUESS_LOCATION", () => {
        it("should update guess location", () => {
            const state = {
                ...mockInitialState,
                guessLocation: null,
            };

            const newLocation = [1, 1] as LatLngTuple;
            const newState = gameReducer(state, {
                type: "SET_GUESS_LOCATION",
                payload: { location: newLocation }
            });

            expect(newState.guessLocation).toEqual(newLocation);
        });
    });
});
