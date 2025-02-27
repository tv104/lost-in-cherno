import { 
    loadGuessedLocations, 
    saveRoundLocation, 
    getNewGameLocations, 
    clearLocationHistory,
    GUESSED_LOCATIONS_STORAGE_KEY
  } from './locations';
  import { LocationConfig } from '../types';

  describe('location utilities', () => {
    const sampleLocationConfigs: LocationConfig[] = [
      { id: 'loc1', image: 'image1.jpg', location: [51.5, -0.1], panCorrection: 0 },
      { id: 'loc2', image: 'image2.jpg', location: [40.7, -74.0], panCorrection: 0 },
      { id: 'loc3', image: 'image3.jpg', location: [35.7, 139.8], panCorrection: 0 },
      { id: 'loc4', image: 'image4.jpg', location: [48.9, 2.3], panCorrection: 0 },
      { id: 'loc5', image: 'image5.jpg', location: [37.8, -122.4], panCorrection: 0 },
    ];
  
    let localStorageMock: { [key: string]: string } = {};
    
    beforeEach(() => {
      // Clear mock localStorage before each test
      localStorageMock = {};
      
      // Setup localStorage mock
      Storage.prototype.getItem = jest.fn(key => localStorageMock[key] || null);
      Storage.prototype.setItem = jest.fn((key, value) => {
        localStorageMock[key] = String(value);
      });
      Storage.prototype.removeItem = jest.fn(key => {
        delete localStorageMock[key];
      });
      
      // Silence console.error during tests
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });
  
    afterEach(() => {
      jest.restoreAllMocks();
    });
  
    describe('loadGuessedLocations', () => {
      it('should return an empty array when no locations are stored', () => {
        const result = loadGuessedLocations();
        expect(result).toEqual([]);
        expect(localStorage.getItem).toHaveBeenCalledWith(GUESSED_LOCATIONS_STORAGE_KEY);
      });
  
      it('should return stored locations when available', () => {
        const storedLocations = ['loc1', 'loc2'];
        localStorageMock[GUESSED_LOCATIONS_STORAGE_KEY] = JSON.stringify(storedLocations);
        
        const result = loadGuessedLocations();
        expect(result).toEqual(storedLocations);
      });
  
      it('should handle JSON parse errors gracefully', () => {
        localStorageMock[GUESSED_LOCATIONS_STORAGE_KEY] = 'invalid-json';
        
        const result = loadGuessedLocations();
        expect(result).toEqual([]);
        expect(console.error).toHaveBeenCalled();
      });
    });
  
    describe('saveRoundLocation', () => {
      it('should add a new location to empty history', () => {
        saveRoundLocation('loc1');
        
        expect(localStorage.setItem).toHaveBeenCalledWith(
          GUESSED_LOCATIONS_STORAGE_KEY, 
          JSON.stringify(['loc1'])
        );
      });
  
      it('should append a new location to existing history', () => {
        localStorageMock[GUESSED_LOCATIONS_STORAGE_KEY] = JSON.stringify(['loc1', 'loc2']);
        
        saveRoundLocation('loc3');
        
        expect(localStorage.setItem).toHaveBeenCalledWith(
          GUESSED_LOCATIONS_STORAGE_KEY, 
          JSON.stringify(['loc1', 'loc2', 'loc3'])
        );
      });
  
      it('should handle localStorage errors gracefully', () => {
        Storage.prototype.setItem = jest.fn().mockImplementation(() => {
          throw new Error('Storage error');
        });
        
        saveRoundLocation('loc1');
        
        expect(console.error).toHaveBeenCalled();
      });
    });
  
    describe('getNewGameLocations', () => {
      it('should return the requested number of unseen locations', () => {
        localStorageMock[GUESSED_LOCATIONS_STORAGE_KEY] = JSON.stringify(['loc1']);
        
        const result = getNewGameLocations(sampleLocationConfigs, 2);
        
        expect(result.length).toBe(2);
        expect(result.some(p => p.id === 'loc1')).toBe(false);
      });
  
      it('should clear history when not enough unseen locations are available', () => {
        localStorageMock[GUESSED_LOCATIONS_STORAGE_KEY] = JSON.stringify(['loc1', 'loc2', 'loc3', 'loc4']);
        
        const result = getNewGameLocations(sampleLocationConfigs, 3);
        
        expect(result.length).toBe(3);
        expect(localStorage.removeItem).toHaveBeenCalledWith(GUESSED_LOCATIONS_STORAGE_KEY);
      });
  
      it('should throw an error when not enough locations exist for a game', () => {
        expect(() => {
          getNewGameLocations(sampleLocationConfigs.slice(0, 2), 3);
        }).toThrow('Not enough locations to start a new game');
      });
    });
  
    describe('clearLocationHistory', () => {
      it('should remove the storage key from localStorage', () => {
        localStorageMock[GUESSED_LOCATIONS_STORAGE_KEY] = JSON.stringify(['loc1', 'loc2']);
        
        clearLocationHistory();
        
        expect(localStorage.removeItem).toHaveBeenCalledWith(GUESSED_LOCATIONS_STORAGE_KEY);
      });
  
      it('should handle localStorage errors gracefully', () => {
        Storage.prototype.removeItem = jest.fn().mockImplementation(() => {
          throw new Error('Storage error');
        });
        
        clearLocationHistory();
        
        expect(console.error).toHaveBeenCalled();
      });
    });
  });