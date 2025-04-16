import { LayerGroup, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState, useMemo } from "react";
import { MapLabel } from "../../types";
import { cn } from "@/utils";

type Props = {
  mapLabels: MapLabel[];
};

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

  const filteredLabels = useMemo(() => {
    const minZoom = map.getMinZoom();

    return mapLabels.filter((label) => {
      if (zoom <= minZoom) {
        return label.importance === 3;
      } else if (zoom === minZoom + 1) {
        return label.importance >= 2;
      } else {
        return true;
      }
    });
  }, [mapLabels, zoom, map]);

  return (
    <LayerGroup>
      {filteredLabels.map((label: MapLabel) => {
        const labelStyles = cn(
          "whitespace-nowrap !cursor-[inherit] text-[0.95rem] text-shadow-overlay font-medium",
          {
            "text-[0.95rem]": label.importance === 3,
            "text-[0.85rem]": label.importance <= 2,
          }
        );
        return (
          <Marker
            key={label.name}
            position={label.position}
            icon={L.divIcon({
              className: labelStyles,
              html: label.name,
              iconAnchor: [50, 10],
            })}
          />
        );
      })}
    </LayerGroup>
  );
};
