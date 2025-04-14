import { LayerGroup, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import { ThemeUIStyleObject } from "theme-ui";
import { Global } from "theme-ui";
import { MapLabel } from "../../types";

const globalStyles: ThemeUIStyleObject = {
  ".map-label": {
    WebkitTextStroke: "0.2px #000",
    WebkitTextFillColor: "#fff",
    textShadow: "overlay",
    color: "#fff",
    fontSize: ".95rem",
    fontWeight: "500",
    fontFamily: "body",
    whiteSpace: "nowrap",
    cursor: "inherit",
  },
  ".importance-3": {
    fontSize: ".95rem",
  },
  ".importance-2": {
    fontSize: ".85rem",
  },
  ".importance-1": {
    fontSize: ".85rem",
  },
};

type Props = {
  mapLabels: MapLabel[]
}

export const GuessMapLocationLabels: React.FC<Props> = ({ mapLabels }) => {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  useEffect(() => {
    const onZoomEnd = () => {
      setZoom(map.getZoom());
    };

    map.on("zoomend", onZoomEnd);

    return () => {
      map.off("zoomend", onZoomEnd);
    };
  }, [map]);

  const filteredLabels = mapLabels.filter((label) => {
    const minZoom = map.getMinZoom();

    if (zoom <= minZoom) {
      return label.importance === 3;
    } else if (zoom === minZoom + 1) {
      return label.importance >= 2;
    } else {
      return true;
    }
  });

  return (
    <>
      <Global styles={globalStyles} />
      <LayerGroup>
        {filteredLabels.map((label) => (
          <Marker
            key={label.name}
            position={label.position}
            icon={L.divIcon({
              className: `map-label importance-${label.importance}`,
              html: label.name,
              iconAnchor: [50, 10],
            })}
          />
        ))}
      </LayerGroup>
    </>
  );
};
