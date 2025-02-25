import { getHighScore, updateHighScore, resetHighScore } from './high-score';

const mockStorage = {
  store: {} as Record<string, string>,
  getItem: jest.fn(function(key: string): string | null {
    return this.store[key] || null;
  }),
  setItem: jest.fn(function(key: string, value: string): boolean {
    this.store[key] = value;
    return true;
  }),
  clear: function() {
    this.store = {};
  }
};

describe('High Score Utilities', () => {
  beforeEach(() => {
    mockStorage.clear();
    mockStorage.getItem.mockClear();
    mockStorage.setItem.mockClear();
  });

  describe('getHighScore', () => {
    it('should return 0 when no high score is stored', () => {
      const score = getHighScore(mockStorage);
      
      expect(score).toBe(0);
      expect(mockStorage.getItem).toHaveBeenCalledWith('high_score');
    });

    it('should return the stored high score as a number', () => {
      mockStorage.store['high_score'] = '500';
      
      const score = getHighScore(mockStorage);
      
      expect(score).toBe(500);
      expect(mockStorage.getItem).toHaveBeenCalledWith('high_score');
    });

    it('should handle non-numeric stored values and return 0', () => {
      mockStorage.store['high_score'] = 'not-a-number';
      
      const score = getHighScore(mockStorage);
      
      expect(score).toBe(0);
      expect(mockStorage.getItem).toHaveBeenCalledWith('high_score');
    });
  });

  describe('updateHighScore', () => {
    it('should update the high score when new score is higher', () => {
      mockStorage.store['high_score'] = '100';
      
      const result = updateHighScore(200, mockStorage);
      
      expect(result).toBe(200);
      expect(mockStorage.getItem).toHaveBeenCalledWith('high_score');
      expect(mockStorage.setItem).toHaveBeenCalledWith('high_score', '200');
    });

    it('should not update the high score when new score is lower', () => {
      mockStorage.store['high_score'] = '300';
      
      const result = updateHighScore(200, mockStorage);
      
      expect(result).toBe(300);
      expect(mockStorage.getItem).toHaveBeenCalledWith('high_score');
      expect(mockStorage.setItem).not.toHaveBeenCalled();
    });

    it('should update the high score when no previous score exists', () => {
      const result = updateHighScore(200, mockStorage);
      
      expect(result).toBe(200);
      expect(mockStorage.getItem).toHaveBeenCalledWith('high_score');
      expect(mockStorage.setItem).toHaveBeenCalledWith('high_score', '200');
    });

    it('should update the high score when new score equals current high score', () => {
      mockStorage.store['high_score'] = '200';
      
      const result = updateHighScore(200, mockStorage);
      
      expect(result).toBe(200);
      expect(mockStorage.getItem).toHaveBeenCalledWith('high_score');
      expect(mockStorage.setItem).toHaveBeenCalledWith('high_score', '200');
    });
  });

  describe('resetHighScore', () => {
    it('should reset the high score to 0', () => {
      mockStorage.store['high_score'] = '500';
      
      resetHighScore(mockStorage);
      
      expect(mockStorage.setItem).toHaveBeenCalledWith('high_score', '0');
      expect(getHighScore(mockStorage)).toBe(0);
    });
  });
});
