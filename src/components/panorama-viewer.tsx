import { useRef, useCallback, useLayoutEffect, ComponentProps } from "react";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";
import "@photo-sphere-viewer/compass-plugin/index.css";
import { CompassPlugin } from "@photo-sphere-viewer/compass-plugin";
import { useGameState } from "../hooks";
import { cn } from "@/utils";

export const PanoramaViewer: React.FC = () => {
  const { state, dispatch } = useGameState();
  const {
    gameLocations,
    currentRound,
    roundActive,
    isTransitioningRound,
    gameCount,
  } = state;

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
    if (isTransitioningRound) {
      dispatch({
        type: "START_ROUND",
        payload: { currentRound: currentRound },
      });
    }

    if (containerRef.current) {
      containerRef.current.style.willChange = "auto";
    }
    if (currentImageRef.current) {
      currentImageRef.current.style.willChange = "auto";
    }
  }, [dispatch, isTransitioningRound, currentRound]);

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

  const containerStyles = cn(
    "absolute top-0 left-0 right-0 bottom-0 z-panorama transition-filter duration-2000 ease-linear",
    roundActive ? "filter-none" : "grayscale-75 brightness-95"
  );
  const panoramaImageStyles =
    "absolute top-0 left-0 bottom-0 right-0 transition-opacity duration-1500 ease-in";

  const currentImageStyles = cn(
    panoramaImageStyles,
    "z-1",
    isTransitioningRound ? "opacity-0" : "opacity-100"
  );

  const nextImageStyles = cn(panoramaImageStyles, "z-0 opacity-100");

  const handleCurrentPanoramicImgReady = () => {
    dispatch({ type: "CURRENT_IMG_READY" });
  };

  const handleNextPanoramicImgReady = () => {
    dispatch({ type: "NEXT_IMG_READY" });
  };

  return (
    <div className={containerStyles} ref={containerRef}>
      <div
        className={currentImageStyles}
        key={`${src}-${gameCount}`} // gameCount is used to ensure the component re-renders
        onTransitionEnd={handleTransitionEnd}
        ref={currentImageRef}
      >
        <ReactPhotoSphereViewer
          {...commonProps}
          height={commonProps.height || "100%"}
          src={src}
          onReady={handleCurrentPanoramicImgReady}
          sphereCorrection={{
            pan: gameLocations[currentRound - 1].panCorrection,
          }}
        />
      </div>
      {preloadSrc && (
        <div
          className={nextImageStyles}
          key={`${preloadSrc}-${gameCount}`} // gameCount is used to ensure the component re-renders
        >
          <ReactPhotoSphereViewer
            {...commonProps}
            height={commonProps.height || "100%"}
            src={preloadSrc}
            onReady={handleNextPanoramicImgReady}
            sphereCorrection={{
              pan: gameLocations[currentRound].panCorrection,
            }}
          />
        </div>
      )}
    </div>
  );
};
