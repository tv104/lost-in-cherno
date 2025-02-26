import { Button, Text, Heading } from "theme-ui";
import { Overlay } from "./overlay";
import { useState } from "react";
import { useGameStateContext } from "../../contexts";

export const MenuScreen: React.FC = () => {
  const { handleStartGame, firstRoundReady } = useGameStateContext();
  const [isExiting, setIsExiting] = useState(false);

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
