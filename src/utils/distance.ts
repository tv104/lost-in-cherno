import { LatLngTuple } from "leaflet";

export const largeDistanceItems = [
  "axes", "sledges", "shovels", "picks", "mosins",  
  "m4s", "akms", "rods", "sticks", "planks"
];

export const smallDistanceItems = [
  "screwdrivers", "pistol mags",
  "canteens", "radios", "compasses", "tapes",  
  "handcuffs", "bandages",  
  "bean cans", "potatoes", "flares"
];

export const getRandomDistanceItem = (distance: number): string => {
  if (distance > 5000) {
    return largeDistanceItems[Math.floor(Math.random() * largeDistanceItems.length)];
  } else {
    return smallDistanceItems[Math.floor(Math.random() * smallDistanceItems.length)];
  }
};

export const calculateDistance = (point1: LatLngTuple, point2: LatLngTuple): number => {
    const [lat1, lon1] = point1;
    const [lat2, lon2] = point2;
    return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2)) * 100;
  };
  