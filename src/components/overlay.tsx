import { ThemeUIStyleObject, Box } from "theme-ui";
import { Footer } from "./footer";
import { Logo } from "./logo";

type Props = {
  children: React.ReactNode;
  isExiting: boolean;
  onExited: () => void;
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
    zIndex: "overlay",
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

export const Overlay: React.FC<Props> = ({ children, isExiting, onExited }) => {
  return (
    <Box
      sx={{
        ...styles.container,
        opacity: isExiting ? 0 : 1,
        pointerEvents: isExiting ? "none" : "auto",
      }}
      onTransitionEnd={isExiting ? onExited : undefined}
    >
      <Box sx={styles.contentContainer}>
        <Logo sx={styles.logo} />
        {children}
      </Box>
      <Footer sx={styles.footer} />
    </Box>
  );
};
