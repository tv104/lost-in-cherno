export const GAME_CONFIG = {
  ROUNDS_PER_GAME: 2,
  SECONDS_PER_ROUND: 30,
};

export type RoundResult = {
  locationId: string;
  distance: number | null;
  timeLeft: number;
};