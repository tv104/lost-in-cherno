import { calculateDistance, getRandomDistanceItem, largeDistanceItems, smallDistanceItems } from './distance';
import { LatLngTuple } from 'leaflet';

describe('distance utilities', () => {
  describe('calculateDistance', () => {
    it('should calculate distance between two identical points as 0', () => {
      const point: LatLngTuple = [0, 0];
      const distance = calculateDistance(point, point);
      expect(distance).toBe(0);
    });

    it('should calculate correct distance between two points', () => {
      const point1: LatLngTuple = [0, 0];
      const point2: LatLngTuple = [3, 4];
      const distance = calculateDistance(point1, point2);
      // sqrt(3^2 + 4^2) * 100 = 5 * 100 = 500
      expect(distance).toBe(500);
    });

    it('should handle negative coordinates correctly', () => {
      const point1: LatLngTuple = [-1, -1];
      const point2: LatLngTuple = [2, 3];
      const distance = calculateDistance(point1, point2);
      expect(distance).toBe(500);
    });

    it('should return a positive distance regardless of point order', () => {
      const point1: LatLngTuple = [10, 20];
      const point2: LatLngTuple = [20, 30];
      const distance1 = calculateDistance(point1, point2);
      const distance2 = calculateDistance(point2, point1);
      expect(distance1).toBeGreaterThan(0);
      expect(distance2).toBeGreaterThan(0);
      expect(distance1).toBe(distance2);
    });
  });

  describe('getRandomDistanceItem', () => {
    it('should return a large item for distances greater than 5000', () => {
      const distance = 5001;
      const item = getRandomDistanceItem(distance);
      expect(largeDistanceItems).toContain(item);
    });

    it('should return a small item for distances less than or equal to 5000', () => {
      const distance = 5000;
      const item = getRandomDistanceItem(distance);
      expect(smallDistanceItems).toContain(item);
    });
  });
}); 