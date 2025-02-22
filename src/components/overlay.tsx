import { ThemeUIStyleObject, Box } from "theme-ui";
import { Footer } from "./footer";
import { Logo } from "./logo";

type Props = {
  children: React.ReactNode;
  isFadingOut: boolean;
  onFadeOutComplete: () => void;
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
    justifyContent: "flex-start",
    zIndex: "menu",
    p: 4,
    overflowY: "auto",
    opacity: 1,
    transition: "opacity 2s ease-in",
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    my: "auto",
    textAlign: "center",
    pb: 5,
  },
  footer: {
    mt: "auto",
  },
  logo: {
    mb: 4,
  },
};

export const Overlay: React.FC<Props> = ({
  children,
  isFadingOut,
  onFadeOutComplete,
}) => {
  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (e.target === e.currentTarget && isFadingOut) {
      onFadeOutComplete();
    }
  };

  return (
    <Box
      sx={{
        ...styles.container,
        opacity: isFadingOut ? 0 : 1,
        pointerEvents: isFadingOut ? "none" : "auto",
      }}
      onTransitionEnd={handleTransitionEnd}
    >
      <Box sx={styles.contentContainer}>
        <Logo sx={styles.logo} />
        {children}
      </Box>
      <Footer sx={styles.footer} />
    </Box>
  );
};
