import { getRandomDistanceItem } from "./distance";
import { RoundResult } from "./game";
const BASE_POINTS = 10000;
const HIGH_SCORE_KEY = 'high_score';

export const DAYZ_DEATH_MESSAGES = [
  "Player was sniped from 800m",
  "Player used infected bandages",
  "Player died of cholera",
  "Player was killed by a bear",
  "Player fell from a watchtower",
  "Player stepped on a landmine",
  "Player got lost in the woods",
  "Player died from drinking pond water",
  "Player was run over by their own vehicle",
  "Player accidentally ate rotten fruit",
  "Player got stuck in the queue",
  "No message received (connection lost)",
  "Player died to desync while climbing ladder",
  "Player was killed by invisible zombie",
  "Player fell through the map",
  "Player died while loading in",
  "BattlEye: Client not responding",
  "0x000400942 Data verification error",
];

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

export const getRandomDeathMessage = (messages: string[] = DAYZ_DEATH_MESSAGES): string => {
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};

export const formatRoundResult = (distance: number | null, timeLeft: number): string => {
  if (distance === null) {
    return getRandomDeathMessage();
  }
  
  const formattedTime = (timeLeft).toFixed(3) + 's';
  return `${Math.round(distance).toLocaleString()} ${getRandomDistanceItem(distance)} away with ${formattedTime} remaining`;
};

export const storageOperations = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error(`Error getting item from localStorage: ${key}`, e);
      return null;
    }
  },
  
  setItem: (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.error(`Error setting item in localStorage: ${key}`, e);
      return false;
    }
  }
};

export const getHighScore = (storage = storageOperations): number => {
  const stored = storage.getItem(HIGH_SCORE_KEY);
  return stored ? parseInt(stored, 10) : 0;
};

export const updateHighScore = (newScore: number, storage = storageOperations): number => {
  const currentHigh = getHighScore(storage);
  if (newScore > currentHigh) {
    storage.setItem(HIGH_SCORE_KEY, newScore.toString());
    return newScore;
  }
  return currentHigh;
};

export const resetHighScore = (storage = storageOperations): void => {
  storage.setItem(HIGH_SCORE_KEY, '0');
};

export type FormattedRoundResult = {
  round: number;
  result: string;
};

export const formatGameResults = (gameResults: RoundResult[]): FormattedRoundResult[] => {
  return gameResults.map((result, index) => ({
    round: index + 1,
    result: formatRoundResult(result.distance, result.timeLeft),
  }));
};

export const getScoreHeadingMessage = (finalScore: number): string => {
  const highScore = getHighScore();
  const isNewHighScore = finalScore >= highScore;
  
  if (isNewHighScore) {
    updateHighScore(finalScore);
    return `New High Score! ${finalScore.toLocaleString()}`;
  }
  
  return `Score: ${finalScore.toLocaleString()} (Max: ${highScore.toLocaleString()})`;
};
