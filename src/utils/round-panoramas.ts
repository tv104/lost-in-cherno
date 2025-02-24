import { LatLngTuple } from 'leaflet'

export type PanoramaConfig = {
    id: string;
    image: string;
    location: LatLngTuple;
}


const STORAGE_KEY = "guessed_locations_history";
const MAX_HISTORY_SIZE = 100;

let cachedHistoricalLocations: string[] = [];

export function loadGuessedLocations(): string[] {
  if (cachedHistoricalLocations.length > 0) {
    return cachedHistoricalLocations;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    cachedHistoricalLocations = stored ? JSON.parse(stored) : [];
    return cachedHistoricalLocations;
  } catch (e) {
    console.error("Failed to load guessed locations from localStorage:", e);
    return [];
  }
}

export function saveRoundLocation(locationId: string): void {
  try {
    const history = loadGuessedLocations();
    const updatedHistory = [locationId, ...history].slice(0, MAX_HISTORY_SIZE);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (e) {
    console.error("Failed to save guessed location to localStorage:", e);
  }
}

export function getAvailablePanorama(
  locations: PanoramaConfig[],
  excludeIds: string[] = []
): PanoramaConfig {
  const historicalLocations = loadGuessedLocations();
  const allExcludedIds = new Set([...excludeIds, ...historicalLocations]);
  
  const availableLocations = locations.filter(
    loc => !allExcludedIds.has(loc.id)
  );
  
  // If we've used all locations, reset by using all locations except current round's
  const candidateLocations = availableLocations.length > 0 
    ? availableLocations 
    : locations.filter(loc => !excludeIds.includes(loc.id));
  
  const randomLocation = candidateLocations[
    Math.floor(Math.random() * candidateLocations.length)
  ];
    
  return randomLocation;
}
