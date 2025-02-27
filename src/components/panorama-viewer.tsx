import { useRef, useCallback, useLayoutEffect, ComponentProps } from "react";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";
import { Box, ThemeUIStyleObject } from "theme-ui";
import { useGameStateContext } from "../contexts";
import "@photo-sphere-viewer/compass-plugin/index.css";
import { CompassPlugin } from "@photo-sphere-viewer/compass-plugin";

export const PanoramaViewer: React.FC = () => {
  const {
    gameLocations,
    currentRound,
    roundActive,
    isTransitioningRound,
    handleCurrentPanoramicImgReady,
    handleNextPanoramicImgReady,
    handlePanoramaTransitionEnd,
    gameCount,
  } = useGameStateContext();

  const src = gameLocations[currentRound - 1].image;
  const preloadSrc = gameLocations[currentRound]?.image;

  const commonProps: Partial<ComponentProps<typeof ReactPhotoSphereViewer>> = {
    height: "100vh",
    width: "100%",
    // littlePlanet: true, // TODO hardmode combined with other visual effects
    navbar: false,
    hideNavbarButton: true,
    plugins: [
      [
        CompassPlugin,
        {
          position: "top center",
          navigation: false,
          size: "120px",
        },
      ],
    ],
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const currentImageRef = useRef<HTMLDivElement>(null);

  const handleTransitionEnd = useCallback(() => {
    handlePanoramaTransitionEnd();

    if (containerRef.current) {
      containerRef.current.style.willChange = "auto";
    }
    if (currentImageRef.current) {
      currentImageRef.current.style.willChange = "auto";
    }
  }, [handlePanoramaTransitionEnd]);

  // Apply willChange before transitions start
  useLayoutEffect(() => {
    if (isTransitioningRound || !roundActive) {
      if (containerRef.current) {
        containerRef.current.style.willChange = "filter";
      }
      if (currentImageRef.current) {
        currentImageRef.current.style.willChange = "filter";
      }
    }
  }, [isTransitioningRound, roundActive]);

  const styles: Record<string, ThemeUIStyleObject> = {
    container: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: "panorama",
      filter: roundActive ? "none" : "grayscale(0.75) brightness(0.95)",
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
    <Box sx={styles.container} ref={containerRef}>
      <Box
        sx={{ ...styles.panoramaImage, ...styles.currentImage }}
        key={`${src}-${gameCount}`} // gameCount is used to ensure the component re-renders
        onTransitionEnd={handleTransitionEnd}
        ref={currentImageRef}
      >
        <ReactPhotoSphereViewer
          {...commonProps}
          height={commonProps.height || "100%"}
          src={src}
          containerClass="current-pano-img"
          onReady={handleCurrentPanoramicImgReady}
          sphereCorrection={{
            pan: gameLocations[currentRound - 1].panCorrection,
          }}
        />
      </Box>
      {preloadSrc && (
        <Box
          sx={{ ...styles.panoramaImage, ...styles.nextImage }}
          key={`${preloadSrc}-${gameCount}`} // gameCount is used to ensure the component re-renders
        >
          <ReactPhotoSphereViewer
            {...commonProps}
            height={commonProps.height || "100%"}
            src={preloadSrc}
            containerClass="next-pano-img"
            onReady={handleNextPanoramicImgReady}
            sphereCorrection={{
              pan: gameLocations[currentRound].panCorrection,
            }}
          />
        </Box>
      )}
    </Box>
  );
};
