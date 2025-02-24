import { LatLngTuple } from 'leaflet'

export type PanoramaConfig = {
    id: string;
    image: string;
    location: LatLngTuple;
}

const STORAGE_KEY = "guessed_locations_history";

export function loadGuessedLocations(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (e) {
    console.error("Failed to save guessed location to localStorage:", e);
  }
}

export function getPanoramasForNewGame(panoramas: PanoramaConfig[], roundsPerGame: number): PanoramaConfig[] {
  const historicalLocations = loadGuessedLocations();
  let availablePanoramas = panoramas.filter(
    panorama => !historicalLocations.includes(panorama.id)
  );

  if (availablePanoramas.length < roundsPerGame) {
    // try to fill remaining slots with historical locations
    const historicalPanoramas = panoramas.filter(
      panorama => historicalLocations.includes(panorama.id)
    );
    
    availablePanoramas = [
      ...availablePanoramas,
      ...historicalPanoramas
    ];

    if (availablePanoramas.length < roundsPerGame) {
      throw new Error("Not enough locations to start a new game");
    }
  }

  availablePanoramas.sort(() => Math.random() - 0.5);
  return availablePanoramas.slice(0, roundsPerGame);
}