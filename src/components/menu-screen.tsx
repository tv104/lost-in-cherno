import { Button, Text, Heading } from "theme-ui";
import Overlay from "./overlay";
import { useState } from "react";

type Props = {
  onStartGame: () => void;
  panoramicImgReady: boolean;
};

const MenuScreen: React.FC<Props> = ({ onStartGame, panoramicImgReady }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  return (
    <Overlay isFadingOut={isFadingOut} onFadeOutComplete={onStartGame}>
      <Heading>A DayZ GeoGuessr</Heading>
      <Text>Guess the ingame location before time runs out</Text>
      <Button
        onClick={() => setIsFadingOut(true)}
        disabled={!panoramicImgReady}
      >
        Play
      </Button>
    </Overlay>
  );
};

export default MenuScreen;
