import { ThemeUIStyleObject } from "theme-ui";

export const BUTTON_HEIGHT = 56;
const SIZE = 420;
const SMOL_SIZE = SIZE * 0.75;
const GAP = 12;
const EASING_FN = "cubic-bezier(0.4, 0, 0.2, 1)";

export const globalStyles: ThemeUIStyleObject = {
  ".leaflet-container": {
    height: "100vh",
    width: "100%",
    backgroundColor: "mapBackground",
  },

  ".leaflet-marker-icon": {
    filter: "drop-shadow(1px 5px 3px rgba(0,0,0,0.6))",
    '&:nth-of-type(1)': {
      filter: "drop-shadow(1px 5px 3px rgba(0,0,0,0.6)) hue-rotate(-60deg)",
    }
  },
};

export const createStyles = (isExpanded: boolean): Record<string, ThemeUIStyleObject> => {
  const duration = isExpanded ? "0.1s" : "0.4s";

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
        size: SIZE,
        position: "absolute",
        top: 0,
        right: 0,
        borderRadius: 'medium',
        transform: isExpanded ? "scale(1)" : "scale(0.75)",
        transformOrigin: "top right",
        transition: `transform ${duration} ${EASING_FN}, filter ${duration} ${EASING_FN}`,
        filter: isExpanded ? "none" : "opacity(0.9)",
      },
    },
  };
}; 