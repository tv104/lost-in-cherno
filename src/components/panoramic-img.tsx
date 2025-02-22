import { ComponentProps } from "react";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";
import { EquirectangularAdapter } from "@photo-sphere-viewer/core";
import { Box, ThemeUIStyleObject } from "theme-ui";

const styles: Record<string, ThemeUIStyleObject> = {
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: "panorama",
    // filter: "grayscale(0.75)", // todo
  },
};

type Props = {
  src: ComponentProps<typeof ReactPhotoSphereViewer>["src"];
  onReady: () => void;
};

const PanoramicImg: React.FC<Props> = ({ src, onReady }) => {
  return (
    <Box sx={styles.container}>
      <ReactPhotoSphereViewer
        key={src.toString()}
        src={src}
        height="100vh"
        width="100%"
        // littlePlanet={true}
        navbar={false}
        hideNavbarButton={true}
        // TODO loading state
        adapter={[
          EquirectangularAdapter,
          {
            backgroundColor: "background",
          },
        ]}
        onReady={onReady}
      />
    </Box>
  );
};

export default PanoramicImg;
