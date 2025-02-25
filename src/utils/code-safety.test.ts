import { assertNotNull } from './code-safety';

describe('code-safety utilities', () => {
  describe('assertNotNull', () => {
    it('should not throw an error when value is not null', () => {
      const value = 'test';
      const name = 'testValue';
      
      expect(() => assertNotNull(value, name)).not.toThrow();
    });

    it('should throw an error when value is null', () => {
      const value = null;
      const name = 'testValue';
      
      expect(() => assertNotNull(value, name)).toThrow(`Unexpected 'testValue' is null.`);
    });

    it('should properly narrow the type after assertion', () => {
      const value: string | null = 'test';
      const name = 'testValue';
      
      assertNotNull(value, name);
      
      // Assert - TypeScript compilation would fail if type narrowing didn't work
      // This is more of a TypeScript test than a runtime test
      const length: number = value.length;
      expect(length).toBe(4);
    });
  });
});
