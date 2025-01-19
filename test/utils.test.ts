import { getTaskId } from '../src/utils';

describe('utils', () => {
  describe('getTaskId', () => {
    beforeEach(() => {
      // Reset module state between tests
      jest.resetModules();
      require('../src/utils');
    });

    it('should return incremental IDs when incremental is true', () => {
      const firstId = getTaskId(true);
      const secondId = getTaskId(true);
      const thirdId = getTaskId(true);

      expect(secondId).toBe(firstId + 1);
      expect(thirdId).toBe(secondId + 1);
    });

    it('should return random IDs when incremental is false', () => {
      const firstId = getTaskId(false);
      const secondId = getTaskId(false);

      expect(firstId).toBeGreaterThanOrEqual(0);
      expect(firstId).toBeLessThan(100000000);
      expect(secondId).toBeGreaterThanOrEqual(0);
      expect(secondId).toBeLessThan(100000000);
      // Random IDs should be different
      expect(firstId).not.toBe(secondId);
    });

    it('should use incremental IDs by default', () => {
      const firstId = getTaskId();
      const secondId = getTaskId();

      expect(secondId).toBe(firstId + 1);
    });
  });
});
