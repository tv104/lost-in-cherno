import { ThemeUIStyleObject, Box } from "theme-ui";
import { Footer } from "./footer";
import { Logo } from "../logo/logo";
import { useEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
  isExiting: boolean;
  onExited: () => void;
};

const TRANSITION_DURATION = 2000;

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
    transition: `opacity ${TRANSITION_DURATION}ms ease-in`,
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
  const containerRef = useRef<HTMLDivElement>(null);
  const isTransitioning = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isExiting && !isTransitioning.current) {
      isTransitioning.current = true;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        onExited();
        isTransitioning.current = false;
      }, TRANSITION_DURATION);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isExiting, onExited]);

  return (
    <Box
      ref={containerRef}
      sx={{
        ...styles.container,
        opacity: isExiting ? 0 : 1,
        pointerEvents: isExiting ? "none" : "auto",
        willChange: isExiting ? "opacity" : "auto",
      }}
    >
      <Box sx={styles.contentContainer}>
        <Logo sx={styles.logo} />
        {children}
      </Box>
      <Footer sx={styles.footer} />
    </Box>
  );
};
