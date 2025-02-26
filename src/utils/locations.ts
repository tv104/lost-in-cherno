import { LocationConfig } from '../types'

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

export function getNewGameLocations(locations: LocationConfig[], roundsPerGame: number): LocationConfig[] {
  let historicalLocations = loadGuessedLocations();
  
  let unseenLocations = locations.filter(
    location => !historicalLocations.includes(location.id)
  );
  
  // If we don't have enough unseen locations for a full game,
  // clear the history and consider all locations as unseen
  if (unseenLocations.length < roundsPerGame) {
    clearLocationHistory();
    historicalLocations = [];
    unseenLocations = [...locations];

    if (unseenLocations.length < roundsPerGame) {
      throw new Error("Not enough locations to start a new game");
    }
  }
  
  unseenLocations.sort(() => Math.random() - 0.5);
  return unseenLocations.slice(0, roundsPerGame);
}

export function clearLocationHistory(): void {
  try {
    localStorage.removeItem(GUESSED_LOCATIONS_STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear location history:", e);
  }
}