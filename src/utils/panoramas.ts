import { LatLngTuple } from 'leaflet'

export type PanoramaConfig = {
    id: string;
    image: string;
    location: LatLngTuple;
}

export const GUESSED_LOCATIONS_STORAGE_KEY = "guessed_locations_history";

export function loadGuessedLocations(): string[] {
  try {
    const stored = localStorage.getItem(GUESSED_LOCATIONS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load guessed locations from localStorage:", e);
    return [];
  }
}

export function saveRoundLocation(locationId: string): void {
  try {
    const history = loadGuessedLocations();
    const updatedHistory = [...history, locationId];
    localStorage.setItem(GUESSED_LOCATIONS_STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (e) {
    console.error("Failed to save guessed location to localStorage:", e);
  }
}

export function getPanoramasForNewGame(panoramas: PanoramaConfig[], roundsPerGame: number): PanoramaConfig[] {
  let historicalLocations = loadGuessedLocations();
  
  let unseenPanoramas = panoramas.filter(
    panorama => !historicalLocations.includes(panorama.id)
  );
  
  // If we don't have enough unseen panoramas for a full game,
  // clear the history and consider all panoramas as unseen
  if (unseenPanoramas.length < roundsPerGame) {
    clearLocationHistory();
    historicalLocations = [];
    unseenPanoramas = [...panoramas];

    if (unseenPanoramas.length < roundsPerGame) {
      throw new Error("Not enough panoramas to start a new game");
    }
  }
  
  unseenPanoramas.sort(() => Math.random() - 0.5);
  return unseenPanoramas.slice(0, roundsPerGame);
}

export function clearLocationHistory(): void {
  try {
    localStorage.removeItem(GUESSED_LOCATIONS_STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear location history:", e);
  }
}