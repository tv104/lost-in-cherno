const HIGH_SCORE_KEY = 'high_score';

const storageOperations = {
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
  if (!stored) return 0;
  
  const parsed = parseInt(stored, 10);
  return isNaN(parsed) ? 0 : parsed;
};

export const updateHighScore = (newScore: number, storage = storageOperations): number => {
  const currentHigh = getHighScore(storage);
  if (newScore >= currentHigh) {
    storage.setItem(HIGH_SCORE_KEY, newScore.toString());
    return newScore;
  }
  return currentHigh;
};

export const resetHighScore = (storage = storageOperations): void => {
  storage.setItem(HIGH_SCORE_KEY, '0');
};