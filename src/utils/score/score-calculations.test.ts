import { calculateRoundScore, calculateTotalScore } from './score-calculation';
import { RoundResult } from '../../types';

describe('Score Calculation Utilities', () => {
  const MAX_TIME_PER_ROUND = 30; 
  const BASE_POINTS = 10000;
  
  describe('calculateRoundScore', () => {
    it('should return 0 when distance is null', () => {
      const score = calculateRoundScore(null, 10, MAX_TIME_PER_ROUND);
      expect(score).toBe(0);
    });

    it('should calculate score based on distance and time left', () => {
      const score = calculateRoundScore(500, 15, MAX_TIME_PER_ROUND);
      expect(score).toBe(14250);
    });

    it('should return only distance points when time left is 0', () => {
      const score = calculateRoundScore(1000, 0, MAX_TIME_PER_ROUND);
      expect(score).toBe(9000);
    });

    it('should cap time bonus at MAX_TIME_BONUS_PERCENTAGE', () => {
      const score = calculateRoundScore(2000, 30, MAX_TIME_PER_ROUND);
      expect(score).toBe(12000);
    });

    it('should return 0 when distance exceeds BASE_POINTS', () => {
      const score = calculateRoundScore(15000, 5, MAX_TIME_PER_ROUND);
      expect(score).toBe(0);
    });

    it('should round distance and time bonus values', () => {
      const score = calculateRoundScore(1234, 7.89, MAX_TIME_PER_ROUND);
      expect(score).toBe(11071);
    });
    
    it('should adjust time bonus based on maxTimePerRound', () => {
      const score = calculateRoundScore(500, 15, 60);
      expect(score).toBe(11875);
    });
  });

  describe('calculateTotalScore', () => {
    it('should return 0 for empty results array', () => {
      const score = calculateTotalScore([], MAX_TIME_PER_ROUND);
      expect(score).toBe(0);
    });

    it('should sum scores from all rounds', () => {
      const results: RoundResult[] = [
        { locationId: 'loc1', distance: 500, timeLeft: 15 },
        { locationId: 'loc2', distance: 1000, timeLeft: 10 },
        { locationId: 'loc3', distance: null, timeLeft: 5 }
      ];
      
      const score = calculateTotalScore(results, MAX_TIME_PER_ROUND);
      expect(score).toBe(26250);
    });

    it('should handle all null distances', () => {
      const results: RoundResult[] = [
        { locationId: 'loc1', distance: null, timeLeft: 15 },
        { locationId: 'loc2', distance: null, timeLeft: 10 }
      ];
      
      const score = calculateTotalScore(results, MAX_TIME_PER_ROUND);
      expect(score).toBe(0);
    });

    it('should correctly calculate with mixed valid and null distances', () => {
      const results: RoundResult[] = [
        { locationId: 'loc1', distance: 800, timeLeft: 5 },
        { locationId: 'loc2', distance: null, timeLeft: 10 },
        { locationId: 'loc3', distance: 1500, timeLeft: 15 }
      ];
      
      const score = calculateTotalScore(results, MAX_TIME_PER_ROUND);
      expect(score).toBe(23483);
    });
    
    it('should adjust calculations based on different maxTimePerRound', () => {
      const results: RoundResult[] = [
        { locationId: 'loc1', distance: 500, timeLeft: 15 },
        { locationId: 'loc2', distance: 1000, timeLeft: 10 }
      ];
      
      const score = calculateTotalScore(results, 60);
      expect(score).toBe(22375);
    });
  });

  describe('Additional Score Calculation Tests', () => {
    const MAX_TIME_PER_ROUND = 30;
    
    describe('calculateRoundScore edge cases', () => {
      it('should handle negative distance values appropriately', () => {
        const score = calculateRoundScore(-500, 15, MAX_TIME_PER_ROUND);
        expect(score).toBe(15750);
      });
      
      it('should handle negative timeLeft values appropriately', () => {
        const score = calculateRoundScore(500, -5, MAX_TIME_PER_ROUND);
        expect(score).toBe(7917);
      });
      
      it('should prevent division by zero with zero maxTimePerRound', () => {
        const score = calculateRoundScore(500, 15, 0);
        expect(score).toBeGreaterThanOrEqual(0);
      });
      
      it('should handle distance exactly equal to BASE_POINTS', () => {
        const score = calculateRoundScore(10000, 15, MAX_TIME_PER_ROUND);
        expect(score).toBe(0);
      });
      
      it('should handle distance just below BASE_POINTS', () => {
        const score = calculateRoundScore(9999, 15, MAX_TIME_PER_ROUND);
        expect(score).toBe(2);
      });
      
      it('should handle fractional distances correctly', () => {
        const score = calculateRoundScore(5000.7, 15, MAX_TIME_PER_ROUND);
        expect(score).toBe(7499);
      });
      
      it('should handle very small time values', () => {
        const score = calculateRoundScore(5000, 0.1, MAX_TIME_PER_ROUND);
        const distancePoints = BASE_POINTS - Math.round(5000);
        const timeBonus = Math.round(distancePoints * (0.1/30));
        expect(score).toBe(distancePoints + timeBonus);
      });
    });
    
    describe('calculateTotalScore additional tests', () => {
      it('should handle a large number of results', () => {
        const results: RoundResult[] = Array(100).fill(null).map((_, i) => ({
          locationId: `loc${i}`,
          distance: 1000,
          timeLeft: 10
        }));
        
        const score = calculateTotalScore(results, MAX_TIME_PER_ROUND);
        expect(score).toBe(100 * 12000);
      });
      
      it('should handle mixed timeLeft values', () => {
        const results: RoundResult[] = [
          { locationId: 'loc1', distance: 1000, timeLeft: 0 },
          { locationId: 'loc2', distance: 1000, timeLeft: 15 },
          { locationId: 'loc3', distance: 1000, timeLeft: 30 }
        ];
        
        const score = calculateTotalScore(results, MAX_TIME_PER_ROUND);
        expect(score).toBe(36000);
      });
    });
  });
});
