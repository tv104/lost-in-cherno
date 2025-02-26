import { calculateRoundScore, calculateTotalScore } from './score-calculation';
import { RoundResult } from '../../types';

describe('Score Calculation Utilities', () => {
  describe('calculateRoundScore', () => {
    it('should return 0 when distance is null', () => {
      const score = calculateRoundScore(null, 10);
      expect(score).toBe(0);
    });

    it('should calculate score based on distance and time left', () => {
      // BASE_POINTS = 10000
      // Distance points = 10000 - 500 = 9500
      // Time bonus = 15 * 1000 = 15000
      // Total = 9500 + 15000 = 24500
      const score = calculateRoundScore(500, 15);
      expect(score).toBe(24500);
    });

    it('should return only time bonus when distance exceeds BASE_POINTS', () => {
      // Distance points = max(0, 10000 - 15000) = 0
      // Time bonus = 5 * 1000 = 5000
      // Total = 0 + 5000 = 5000
      const score = calculateRoundScore(15000, 5);
      expect(score).toBe(5000);
    });

    it('should round distance and time bonus values', () => {
      // Distance points = 10000 - 1234 = 8766
      // Time bonus = 7.89 * 1000 = 7890
      // Total = 8766 + 7890 = 16656
      const score = calculateRoundScore(1234, 7.89);
      expect(score).toBe(16656);
    });
  });

  describe('calculateTotalScore', () => {
    it('should return 0 for empty results array', () => {
      const score = calculateTotalScore([]);
      expect(score).toBe(0);
    });

    it('should sum scores from all rounds', () => {
      const results: RoundResult[] = [
        { locationId: 'loc1', distance: 500, timeLeft: 15 },
        { locationId: 'loc2', distance: 1000, timeLeft: 10 },
        { locationId: 'loc3', distance: null, timeLeft: 5 }
      ];
      
      // Round 1: 9500 + 15000 = 24500
      // Round 2: 9000 + 10000 = 19000
      // Round 3: 0 (null distance)
      // Total: 24500 + 19000 + 0 = 43500
      
      const score = calculateTotalScore(results);
      expect(score).toBe(43500);
    });

    it('should handle all null distances', () => {
      const results: RoundResult[] = [
        { locationId: 'loc1', distance: null, timeLeft: 15 },
        { locationId: 'loc2', distance: null, timeLeft: 10 }
      ];
      
      const score = calculateTotalScore(results);
      expect(score).toBe(0);
    });

    it('should correctly calculate with mixed valid and null distances', () => {
      const results: RoundResult[] = [
        { locationId: 'loc1', distance: 800, timeLeft: 5 },
        { locationId: 'loc2', distance: null, timeLeft: 10 },
        { locationId: 'loc3', distance: 1500, timeLeft: 15 }
      ];
      
      // Round 1: 9200 + 5000 = 14200
      // Round 2: 0 (null distance)
      // Round 3: 8500 + 15000 = 23500
      // Total: 14200 + 0 + 23500 = 37700
      
      const score = calculateTotalScore(results);
      expect(score).toBe(37700);
    });
  });
});
