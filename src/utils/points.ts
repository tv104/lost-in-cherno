import { getRandomDistanceItem } from "./distance";
import { RoundResult } from "./game";
const BASE_POINTS = 10000;
const HIGH_SCORE_KEY = 'high_score';


export const calculateRoundPoints = (distance: number | null, timeLeft: number): number => {
  if (distance === null) return 0;
  const distancePoints = Math.max(0, BASE_POINTS - Math.round(distance));
  const timeBonus = Math.round(timeLeft * 1000);
  return distancePoints + timeBonus;
};

export const calculateTotalScore = (results: RoundResult[]): number => {
  return results.reduce((total, result) => {
    return total + calculateRoundPoints(result.distance, result.timeLeft);
  }, 0);
};

export const formatRoundResult = (distance: number | null, timeLeft: number): string => {
  if (distance === null) return "Player was AFK";
  return `${Math.round(distance)} ${getRandomDistanceItem(distance)} away, ${timeLeft.toFixed(2)}s remaining`;
};

export const getHighScore = (): number => {
  const stored = localStorage.getItem(HIGH_SCORE_KEY);
  return stored ? parseInt(stored, 10) : 0;
};

export const updateHighScore = (newScore: number): number => {
  const currentHigh = getHighScore();
  if (newScore > currentHigh) {
    localStorage.setItem(HIGH_SCORE_KEY, newScore.toString());
    return newScore;
  }
  return currentHigh;
};
