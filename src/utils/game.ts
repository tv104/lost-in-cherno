export const GAME_CONFIG = {
  ROUNDS_PER_GAME: 3,
  SECONDS_PER_ROUND: 3,
};

export type RoundResult = {
  locationId: string;
  distance: number | null;
  timeLeft: number;
};