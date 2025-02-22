import { LatLngTuple } from "leaflet";

const largeItems = [
  "axes", "sledges", "shovels", "picks", "mosins",  
  "m4s", "akms", "rods", "sticks", "planks"
];

const smallItems = [
  "screwdrivers", "pistol mags",
  "canteens", "radios", "compasses", "tapes",  
  "handcuffs", "bandages",  
  "beans", "potatoes", "flares"
];

export const getRandomDistanceItem = (distance: number): string => {
  if (distance > 5000) {
    return largeItems[Math.floor(Math.random() * largeItems.length)];
  } else {
    return smallItems[Math.floor(Math.random() * smallItems.length)];
  }
};

export const calculateDistance = (point1: LatLngTuple, point2: LatLngTuple): number => {
    const [lat1, lon1] = point1;
    const [lat2, lon2] = point2;
    return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2)) * 100;
  };
  