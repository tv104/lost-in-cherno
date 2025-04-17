import { Dispatch, useCallback, useEffect, useMemo, useState } from "react";
import { GameState } from "../types";
import { GameAction } from "../reducers/game-reducer";
import { getNewGameLocations } from "../utils";
import { calculateDistance } from "../utils";

type Props = {
    state: GameState,
    timeLeft: number,
    showAnswer: boolean,
    resetTimer: () => void,
    dispatch: Dispatch<GameAction>,
}

type ReturnType = {
    mapButtonDisabled: boolean,
    handleMapButtonClick: () => void,
}

export const useMapButton = ({ state, timeLeft, showAnswer, resetTimer, dispatch }: Props): ReturnType => {
  const [mapButtonDisabled, setMapButtonDisabled] = useState(false);

    useEffect(() => {
        if (showAnswer) {
          setMapButtonDisabled(true);
    
          const timeout = setTimeout(() => {
            setMapButtonDisabled(false);
          }, 500);
    
          return () => clearTimeout(timeout);
        }
      }, [setMapButtonDisabled, showAnswer]);
      
    const disableMapButton = useMemo(() => {
        if (mapButtonDisabled) return true;
        return timeLeft > 0 && !state.guessLocation;
    }, [mapButtonDisabled, timeLeft, state.guessLocation]);

    const handleMapButtonClick = useCallback(() => {
      const { roundActive, guessLocation, gameLocations, currentRound, gameCount, allLocations, maxRounds } = state;

      if (disableMapButton) return;

      const roundLocation = gameLocations[currentRound - 1].location;

      setMapButtonDisabled(true);

      if (roundActive && guessLocation) {
      const distance = calculateDistance(guessLocation, roundLocation);

      dispatch({
          type: "END_ROUND",
          payload: {
          locationId: gameLocations[currentRound - 1].id,
          distance,
          timeLeft,
          },
      });
      } else if (!roundActive) {
      if (currentRound >= maxRounds) {
          const currentGameLocationIds = gameLocations.map((loc) => loc.id);

          const newGameLocations = getNewGameLocations(
          allLocations,
          maxRounds,
          currentGameLocationIds
          );

          dispatch({
          type: "END_GAME",
          payload: {
              gameCount,
              newGameLocations,
          },
          });

          resetTimer();
      } else {
          dispatch({ type: "TRANSITION_ROUND" });
          resetTimer();
      }
      }

      setTimeout(() => {
      setMapButtonDisabled(false);
      }, 500);
  }, [disableMapButton, state, setMapButtonDisabled, timeLeft, resetTimer, dispatch]);

    return {
      mapButtonDisabled: disableMapButton,
      handleMapButtonClick
    }
}
