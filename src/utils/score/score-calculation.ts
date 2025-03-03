import { RoundResult } from "../../types";

const BASE_POINTS = 10000;
const MAX_TIME_BONUS_PERCENTAGE = 0.5;

export const calculateRoundScore = (
  distance: number | null, 
  timeLeft: number, 
  maxTimePerRound: number
): number => {
  if (distance === null) return 0;
  
  // Calculate distance points - this rewards accuracy
  const distancePoints = Math.max(0, BASE_POINTS - Math.round(distance));
  
  // The time bonus is a percentage of the distance points, capped at MAX_TIME_BONUS_PERCENTAGE
  // This ensures that accuracy is always more important than speed
  const timePercentage = Math.min(timeLeft / maxTimePerRound, MAX_TIME_BONUS_PERCENTAGE);
  const timeBonus = Math.round(distancePoints * timePercentage);
  
  return distancePoints + timeBonus;
};

export const calculateTotalScore = (
  results: RoundResult[], 
  maxTimePerRound: number
): number => {
  return results.reduce((total, result) => {
    return total + calculateRoundScore(result.distance, result.timeLeft, maxTimePerRound);
  }, 0);
};
