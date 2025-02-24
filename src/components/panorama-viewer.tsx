import { ComponentProps } from "react";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";
// import { EquirectangularAdapter } from "@photo-sphere-viewer/core";
import { Box, ThemeUIStyleObject } from "theme-ui";

type Props = {
  src: ComponentProps<typeof ReactPhotoSphereViewer>["src"];
  preloadSrc: ComponentProps<typeof ReactPhotoSphereViewer>["src"];
  onCurrentReady: () => void;
  onNextReady: () => void;
  roundActive: boolean;
};

export const PanoramaViewer: React.FC<Props> = ({
  src,
  preloadSrc,
  onCurrentReady,
  onNextReady,
  roundActive,
}) => {
  const commonProps = {
    height: "100vh",
    width: "100%",
    // littlePlanet: true,
    navbar: false,
    hideNavbarButton: true,
    // TODO loading state
    // adapter={[
    //   EquirectangularAdapter,
    //   {
    //     backgroundColor: "background",
    //   },
    // ]}
  };

  const styles: Record<string, ThemeUIStyleObject> = {
    container: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: "panorama",
      filter: roundActive ? "none" : "grayscale(0.5)",
      transition: "filter 0.15s linear",

      ".current-pano-img": {
        opacity: 1,
      },
      ".next-pano-img": {
        opacity: 0,
      },
    },
  };

  return (
    <Box sx={styles.container}>
      <ReactPhotoSphereViewer
        {...commonProps}
        key={src.toString()}
        src={src}
        containerClass="current-pano-img"
        onReady={onCurrentReady}
      />
      <ReactPhotoSphereViewer
        {...commonProps}
        key={preloadSrc.toString()}
        src={preloadSrc}
        onReady={onNextReady}
        containerClass="next-pano-img"
      />
    </Box>
  );
};
