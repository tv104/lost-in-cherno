import { ThemeUIStyleObject } from "theme-ui";

export const BUTTON_HEIGHT = 56;
export const SIZE = 420;
export const SMOL_SIZE = SIZE * 0.75;
export const GAP = 16;
export const TRANSITION_DURATION = "0.1s";
export const EASING_FN = "cubic-bezier(0.4, 0, 0.2, 1)";
export const EXPAND_DURATION = "0.1s";
export const COLLAPSE_DURATION = "0.4s";

export const globalStyles: ThemeUIStyleObject = {
  ".leaflet-container": {
    height: "100vh",
    width: "100%",
    backgroundColor: "#222222 !important", // TODO: Use theme color
  },

  ".leaflet-marker-icon:nth-child(1)": {
    filter: "hue-rotate(-60deg)",
  },
};

export const createStyles = (isExpanded: boolean): Record<string, ThemeUIStyleObject> => {
  const duration = isExpanded ? EXPAND_DURATION : COLLAPSE_DURATION;
  
  return {
    container: {
      height: `calc(${isExpanded ? SIZE : SMOL_SIZE}px + ${GAP}px + ${BUTTON_HEIGHT}px)`,
      width: isExpanded ? SIZE : SMOL_SIZE,
      position: "absolute",
      bottom: 4,
      right: 4,
      zIndex: "map",
      transition: `width ${duration} ${EASING_FN}, height ${duration} ${EASING_FN}`,

      "& .map": {
        width: SIZE,
        height: SIZE,
        position: "absolute",
        top: 0,
        right: 0,
        borderRadius: "4px",
        transform: isExpanded ? "scale(1)" : "scale(0.75)",
        transformOrigin: "top right",
        transition: `transform ${duration} ${EASING_FN}, filter ${duration} ${EASING_FN}`,
        filter: isExpanded ? "none" : "opacity(0.9)",
      },
    },
    info: {
      position: "absolute",
      top: -BUTTON_HEIGHT - GAP,
      color: "white",
      right: 0,
      left: 0,
      height: BUTTON_HEIGHT,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      textShadow:
        "0px 2px 3px rgba(0,0,0,0.4), 0px 4px 13px rgba(0,0,0,0.1), 0px 8px 23px rgba(0,0,0,0.1)",
    },
    button: {
      position: "absolute",
      bottom: 0,
      right: 0,
      left: 0,
      height: `${BUTTON_HEIGHT}px`,
    },
  };
}; 