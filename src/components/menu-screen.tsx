import { ThemeUIStyleObject, Box, Image, Button, Flex, Text } from "theme-ui";
import { useState } from "react";
import logo from "../assets/logo.webp";
import { Footer } from "./footer";

type Props = {
  visible: boolean;
  onStartGame: () => void;
  panoramicImgReady: boolean;
};

const styles: Record<string, ThemeUIStyleObject> = {
  container: {
    backgroundColor: "background",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "menu",
    transition: "opacity 2s ease-in",
    p: 4,
    pt: 5,
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    marginTop: "auto",
    marginBottom: "auto",
    textAlign: "center",
  },
  logo: {
    width: "100%",
    height: "auto",
    maxWidth: ["320px", "480px"],
    marginBottom: 4,
    aspectRatio: "37/31",
  },
  buttonContainer: {
    my: 4,
  },
  footer: {
    marginTop: "auto",
  },
};

const MenuScreen: React.FC<Props> = ({
  visible,
  onStartGame,
  panoramicImgReady,
}) => {
  const [isFading, setIsFading] = useState(false);

  const handleStartGame = () => {
    setIsFading(true);
  };

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    // Only trigger if it's the opacity transition on the container
    if (e.target === e.currentTarget && isFading) {
      onStartGame();
    }
  };

  if (!visible) return null;
  return (
    <Box
      sx={{
        ...styles.container,
        opacity: isFading ? 0 : 1,
        pointerEvents: isFading ? "none" : "auto",
      }}
      onTransitionEnd={handleTransitionEnd}
    >
      <Box sx={styles.contentContainer}>
        <Image src={logo} alt="Lost in Cherno logo" sx={styles.logo} />
        <Text>A DayZ GeoGuessr</Text>
        <Text>Guess the ingame location before time runs out</Text>
        <Flex sx={styles.buttonContainer}>
          <Button onClick={handleStartGame} disabled={!panoramicImgReady}>
            Play
          </Button>
        </Flex>
      </Box>
      <Footer sx={styles.footer} />
    </Box>
  );
};

export default MenuScreen;
