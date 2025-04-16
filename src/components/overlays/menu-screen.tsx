import { Overlay } from "./overlay";
import { useState } from "react";
import { useGameState } from "../../hooks";
import { Button } from "@/components/ui/button";

export const MenuScreen: React.FC = () => {
  const [isExiting, setIsExiting] = useState(false);
  const { state, dispatch } = useGameState();
  const { firstRoundReady } = state;

  const handleStartGame = () => {
    dispatch({ type: "START_GAME" });
  };

  return (
    <Overlay isExiting={isExiting} onExited={handleStartGame}>
      <h1>A DayZ GeoGuessr</h1>
      <p>Guess the ingame location before time runs out</p>
      <Button
        onClick={() => setIsExiting(true)}
        disabled={!firstRoundReady}
        variant="default"
      >
        Play
      </Button>
    </Overlay>
  );
};
