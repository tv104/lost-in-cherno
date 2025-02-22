import { LocationConfig } from "../locations/chernarus/config";

const STORAGE_KEY = "guessed_locations_history";
const MAX_HISTORY_SIZE = 100;

export function loadGuessedLocations(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load guessed locations from localStorage:", e);
    return [];
  }
}

export function saveGuessedLocation(locationId: string): void {
  try {
    const history = loadGuessedLocations();
    const updatedHistory = [locationId, ...history].slice(0, MAX_HISTORY_SIZE);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (e) {
    console.error("Failed to save guessed location to localStorage:", e);
  }
}

export function getRandomLocation(
  locations: LocationConfig[],
  excludeIds: string[] = []
): LocationConfig {
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
  
  saveGuessedLocation(randomLocation.id);
  
  return randomLocation;
}
