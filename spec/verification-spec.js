const { checkTokenFormat } = require('../src/lib/verification');

/**
 * Check authorization token format.
 *
 * @since 1.0.0
 */
describe('Check authorization token format', () => {
  /**
   * 'While authorization token is being verified.
   *
   * @since 1.0.0
   */
  describe('While authorization token is being verified', () => {
    let errorMessage;
    let authToken;
    let expectedReturn;
    let result;

    /**
     * Before each test.
     *
     * @since 1.0.0
     */
    beforeEach(() => {
      console.log = jasmine.createSpy('log');
      errorMessage = 'Authentication token is incorrectly formatted';
    });

    /**
     * If in token, correct format with Bearer, the token should be returned.
     *
     * @since 1.0.0
     */
    it('If in token, correct format with Bearer, the token should be returned', () => {
      // Arrange.
      authToken = 'Bearer Abc-1234_5678.Abc-1234_5678.Abc-1234_5678';
      expectedReturn = 'Abc-1234_5678.Abc-1234_5678.Abc-1234_5678';

      // Act.
      result = checkTokenFormat(authToken);

      // Assert.
      expect(console.log).toHaveBeenCalledWith('checkTokenFormat', authToken);
      expect(result).toEqual(expectedReturn);
    });

    /**
     * If in token, invalid format with no Bearer, an error should be thrown.
     *
     * @since 1.0.0
     */
    it('If in token, invalid format with no Bearer, an error should be thrown', () => {
      // Arrange.
      authToken = 'Abc-1234_5678+=.Abc-1234_5678+=.Abc-1234_5678+=';

      // Act.
      result = () => checkTokenFormat(authToken);

      // Assert.
      expect(result).toThrowError(SyntaxError, errorMessage);
      expect(console.log).toHaveBeenCalledWith('checkTokenFormat', authToken);
    });

    /**
     * If in token, correct format with no Bearer, an error should be thrown.
     *
     * @since 1.0.0
     */
    it('If in token, correct format with no Bearer, an error should be thrown', () => {
      // Arrange.
      authToken = 'Abc-1234_5678.Abc-1234_5678.Abc-1234_5678';

      // Act.
      result = () => checkTokenFormat(authToken);

      // Assert.
      expect(result).toThrowError(SyntaxError, errorMessage);
      expect(console.log).toHaveBeenCalledWith('checkTokenFormat', authToken);
    });

    /**
     * If in token, invalid format with Bearer, an error should be thrown.
     *
     * @since 1.0.0
     */
    it('If in token, invalid format with Bearer, an error should be thrown', () => {
      // Arrange.
      authToken = 'Bearer Abc-1234_5678+=.Abc-1234_5678+=.Abc-1234_5678+=';

      // Act.
      result = () => checkTokenFormat(authToken);

      // Assert.
      expect(result).toThrowError(SyntaxError, errorMessage);
      expect(console.log).toHaveBeenCalledWith('checkTokenFormat', authToken);
    });

    /**
     * If in token, is empty, an error should be thrown.
     *
     * @since 1.0.0
     */
    it('If in token, is empty, an error should be thrown', () => {
      // Arrange.
      authToken = '';

      // Act.
      result = () => checkTokenFormat(authToken);

      // Assert.
      expect(result).toThrowError(SyntaxError, errorMessage);
      expect(console.log).toHaveBeenCalledWith('checkTokenFormat', authToken);
    });
  });
});
