import { getRandomDistanceItem } from "./distance";
import { RoundResult } from "./game";
const BASE_POINTS = 10000;
const HIGH_SCORE_KEY = 'high_score';

const DAYZ_DEATH_MESSAGES = [
  "Player was sniped from 800m",
  "Player bled out after a gunfight",
  "Player died of cholera",
  "Player was killed by a bear",
  "Player tried to feed the wolves",
  "Player fell from a watchtower",
  "Player died of hypothermia",
  "Player stepped on a landmine",
  "Player was betrayed by Ben",
  "Player got lost in the woods and gave up",
  "Player died from drinking pond water",
  "Player was run over by their own vehicle",
  "Player accidentally ate rotten fruit",
  "Player died to a door glitch",
  "Player was killed by another player wearing a dress",
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

export const formatRoundResult = (distance: number | null, timeLeft: number): string => {
  if (distance === null) {
    return getRandomDeathMessage();
  }
  
  const timeInMs = Math.round(timeLeft * 1000);
  const formattedTime = timeInMs.toLocaleString();
  return `${Math.round(distance).toLocaleString()} ${getRandomDistanceItem(distance)} away with ${formattedTime}ms remaining`;
};

const getRandomDeathMessage = (): string => {
  const randomIndex = Math.floor(Math.random() * DAYZ_DEATH_MESSAGES.length);
  return DAYZ_DEATH_MESSAGES[randomIndex];
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
