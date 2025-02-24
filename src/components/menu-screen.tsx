import { Button, Text, Heading } from "theme-ui";
import { Overlay } from "./overlay";
import { useState } from "react";

type Props = {
  onStartGame: () => void;
  disableStartButton: boolean;
};

export const MenuScreen: React.FC<Props> = ({
  onStartGame,
  disableStartButton,
}) => {
  const [isExiting, setIsExiting] = useState(false);
  return (
    <Overlay isExiting={isExiting} onExited={onStartGame}>
      <Heading>A DayZ GeoGuessr</Heading>
      <Text>Guess the ingame location before time runs out</Text>
      <Button onClick={() => setIsExiting(true)} disabled={disableStartButton}>
        Play
      </Button>
    </Overlay>
  );
};
