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
  const [isFadingOut, setIsFadingOut] = useState(false);
  console.log("isFadingOut", isFadingOut);
  return (
    <Overlay isFadingOut={isFadingOut} onFadeOutComplete={onStartGame}>
      <Heading>A DayZ GeoGuessr</Heading>
      <Text>Guess the ingame location before time runs out</Text>
      <Button
        onClick={() => setIsFadingOut(true)}
        disabled={disableStartButton}
      >
        Play
      </Button>
    </Overlay>
  );
};
