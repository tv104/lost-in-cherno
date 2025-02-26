import { calculateDistance, getRandomDistanceItem } from "./distance";
import { getRandomDeathMessage } from "./death-messages";
import { RoundResult } from "../types";
import { getHighScore, updateHighScore } from "./score/high-score";
import { LatLngTuple } from "leaflet";

export const formatRoundResult = (distance: number | null, timeLeft: number): string => {
  if (distance === null) {
    return getRandomDeathMessage();
  }
  
  const formattedTime = (timeLeft).toFixed(3) + 's';
  return `${Math.round(distance).toLocaleString()} ${getRandomDistanceItem(distance)} away with ${formattedTime} remaining`;
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

export const getResultMessage = (
  guessLocation: LatLngTuple | null,
  roundLocation: LatLngTuple
) => {
  if (!guessLocation) {
    return `You are dead`;
  }

  const distance = Math.round(
    calculateDistance(guessLocation, roundLocation)
  );
  return `${distance.toLocaleString()} ${getRandomDistanceItem(distance)} away`;
};
