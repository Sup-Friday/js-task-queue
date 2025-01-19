import { Logger, logger } from '../src/logger';

describe('Logger', () => {
  let consoleInfoSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('instance methods', () => {
    const testLogger = new Logger();
    const testMessage = 'test message';
    const testData = { foo: 'bar' };

    it('info() should call console.info with provided arguments', () => {
      testLogger.info(testMessage, testData);
      expect(consoleInfoSpy).toHaveBeenCalledWith(testMessage, testData);
    });

    it('warn() should call console.warn with provided arguments', () => {
      testLogger.warn(testMessage, testData);
      expect(consoleWarnSpy).toHaveBeenCalledWith(testMessage, testData);
    });

    it('error() should call console.error with provided arguments', () => {
      testLogger.error(testMessage, testData);
      expect(consoleErrorSpy).toHaveBeenCalledWith(testMessage, testData);
    });
  });

  describe('default logger instance', () => {
    const testMessage = 'test message';

    it('should be an instance of Logger', () => {
      expect(logger).toBeInstanceOf(Logger);
    });

    it('should have all logging methods', () => {
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.error).toBe('function');
    });

    it('should work with the singleton instance', () => {
      logger.info(testMessage);
      logger.warn(testMessage);
      logger.error(testMessage);

      expect(consoleInfoSpy).toHaveBeenCalledWith(testMessage);
      expect(consoleWarnSpy).toHaveBeenCalledWith(testMessage);
      expect(consoleErrorSpy).toHaveBeenCalledWith(testMessage);
    });
  });
});
