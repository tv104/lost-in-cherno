import { Icon, LatLngTuple } from "leaflet";
import markerIconImg from "../icons/images/marker-icon.png";
import { Marker } from "react-leaflet";

const markerIcon = new Icon({
  iconUrl: markerIconImg,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Props = {
  position: LatLngTuple;
};

export const GuessMapMarker: React.FC<Props> = ({ position }) => {
  return <Marker position={position} icon={markerIcon} />;
};
