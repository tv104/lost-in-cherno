import { getRandomDistanceItem } from "./distance";

const BASE_POINTS = 10000;
const HIGH_SCORE_KEY = 'high_score';


export const calculateRoundPoints = (distance: number | null): number => {
  if (distance === null) return 0;
  return Math.max(0, BASE_POINTS - Math.round(distance));
};

export const calculateTotalScore = (results: { distance: number | null }[]): number => {
  return results.reduce((total, result) => {
    return total + calculateRoundPoints(result.distance);
  }, 0);
};

export const formatRoundResult = (distance: number | null): string => {
  if (distance === null) return "Timed out";
  return `${Math.round(distance)} ${getRandomDistanceItem(distance)} away`;
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

export const formatScoreMessage = (score: number): string => {
  const highScore = getHighScore();
  const isNewHighScore = score >= highScore;
  
  if (isNewHighScore) {
    updateHighScore(score);
    return `New High Score! ${score}`;
  }
  
  return `Final Score: ${score} (Max: ${highScore})`;
};
