import { ComponentProps } from "react";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";
import { Box, ThemeUIStyleObject } from "theme-ui";

type Props = {
  src: ComponentProps<typeof ReactPhotoSphereViewer>["src"];
  preloadSrc?: ComponentProps<typeof ReactPhotoSphereViewer>["src"];
  onCurrentReady: () => void;
  onNextReady: () => void;
  roundActive: boolean;
  isTransitioningRound: boolean;
  onTransitionEnd: () => void;
  gameCount: number;
};

export const PanoramaViewer: React.FC<Props> = ({
  src,
  preloadSrc,
  onCurrentReady,
  onNextReady,
  roundActive,
  isTransitioningRound,
  onTransitionEnd,
  gameCount,
}) => {
  const commonProps = {
    height: "100vh",
    width: "100%",
    // littlePlanet: true,
    navbar: false,
    hideNavbarButton: true,
  };

  const styles: Record<string, ThemeUIStyleObject> = {
    container: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: "panorama",
      filter: roundActive ? "none" : "grayscale(0.65)",
      transition: "filter 0.2s linear",
    },
    panoramaImage: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      transition: "filter 1.5s ease-in",
    },
    currentImage: {
      zIndex: 1,
      filter: isTransitioningRound ? "opacity(0)" : "opacity(1)",
    },
    nextImage: {
      zIndex: 0,
      opacity: 1,
    },
  };

  return (
    <Box sx={styles.container}>
      <Box
        sx={{ ...styles.panoramaImage, ...styles.currentImage }}
        key={`${src}-${gameCount}`}
        onTransitionEnd={onTransitionEnd}
      >
        <ReactPhotoSphereViewer
          {...commonProps}
          src={src}
          containerClass="current-pano-img"
          onReady={onCurrentReady}
        />
      </Box>
      {preloadSrc && (
        <Box
          sx={{ ...styles.panoramaImage, ...styles.nextImage }}
          key={`${preloadSrc}-${gameCount}`}
        >
          <ReactPhotoSphereViewer
            {...commonProps}
            src={preloadSrc}
            containerClass="next-pano-img"
            onReady={onNextReady}
          />
        </Box>
      )}
    </Box>
  );
};
