import { RoundResult } from "../game";

const BASE_POINTS = 10000;

export const calculateRoundScore = (distance: number | null, timeLeft: number): number => {
  if (distance === null) return 0;
  const distancePoints = Math.max(0, BASE_POINTS - Math.round(distance));
  const timeBonus = Math.round(timeLeft * 1000);
  return distancePoints + timeBonus;
};

export const calculateTotalScore = (results: RoundResult[]): number => {
  return results.reduce((total, result) => {
    return total + calculateRoundScore(result.distance, result.timeLeft);
  }, 0);
};
