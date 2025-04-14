import { Button, Text, Heading } from "theme-ui";
import { Overlay } from "./overlay";
import { useState } from "react";
import { useGameState } from "../../hooks";

export const MenuScreen: React.FC = () => {
  const [isExiting, setIsExiting] = useState(false);
  const { state, dispatch } = useGameState();
  const { firstRoundReady } = state;

  const handleStartGame = () => {
    dispatch({ type: "START_GAME" });
  };

  return (
    <Overlay isExiting={isExiting} onExited={handleStartGame}>
      <Heading>A DayZ GeoGuessr</Heading>
      <Text>Guess the ingame location before time runs out</Text>
      <Button onClick={() => setIsExiting(true)} disabled={!firstRoundReady}>
        Play
      </Button>
    </Overlay>
  );
};
