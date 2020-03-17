const { checkTokenFormat, checkPayloadValidity } = require('../src/lib/verification');

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

/**
 * Check payload validity.
 *
 * @since 1.0.0
 */
describe('Check payload validity', () => {
  /**
   * While payload is being verified.
   *
   * @since 1.0.0
   */
  describe('While payload is being verified', () => {
    let payload;
    let result;

    /**
     * Before each test.
     *
     * @since 1.0.0
     */
    beforeEach(() => {
      console.log = jasmine.createSpy('log');
    });

    /**
     * Thrown tests define.
     *
     * @since 1.0.0
     */
    const thrownTests = [
      {
        name: 'is empty',
        payload: {},
        error: 'The payload is empty or invalid',
      },
      {
        name: 'is not an object',
        payload: true,
        error: 'The payload is empty or invalid',
      },
      {
        name: 'the "type" key is empty',
        payload: {
          ip: '1.1.1.1',
          ua: 'chrome',
          iat: 99999,
          exp: 99999,
        },
        error: 'The payload key "type" is empty or not a string',
      },
      {
        name: 'the "type" key is not a string',
        payload: {
          type: true,
          ip: '1.1.1.1',
          ua: 'chrome',
          iat: 99999,
          exp: 99999,
        },
        error: 'The payload key "type" is empty or not a string',
      },
      {
        name: 'the "ip" key is empty',
        payload: {
          type: 'app',
          ua: 'chrome',
          iat: 99999,
          exp: 99999,
        },
        error: '',
      },
      {
        name: 'the "ip" key is not a string',
        payload: {
          type: 'app',
          ip: true,
          ua: 'chrome',
          iat: 99999,
          exp: 99999,
        },
        error: '',
      },
      {
        name: 'the "ua" key is empty',
        payload: {
          type: 'app',
          ip: '1.1.1.1',
          iat: 99999,
          exp: 99999,
        },
        error: '',
      },
      {
        name: 'the "ua" key is not a string',
        payload: {
          type: 'app',
          ip: '1.1.1.1',
          ua: true,
          iat: 99999,
          exp: 99999,
        },
        error: '',
      },
      {
        name: 'the "iat" key is not a number',
        payload: {
          type: 'app',
          ip: '1.1.1.1',
          ua: 'chrome',
          iat: true,
          exp: 99999,
        },
        error: 'The payload key "iat" is not a number',
      },
      {
        name: 'the "exp" key is not a number',
        payload: {
          type: 'app',
          ip: '1.1.1.1',
          ua: 'chrome',
          iat: 99999,
          exp: true,
        },
        error: 'The payload key "exp" is not a number',
      },
    ];

    /**
     * Thrown tests for each.
     *
     * @since 1.0.0
     */
    thrownTests.forEach((thrownTest) => {
      /**
       * If in payload, {thrownTest.name}, an error should be thrown.
       *
       * @since 1.0.0
       */
      it(`If in payload, ${thrownTest.name}, an error should be thrown`, () => {
        // Arrange.
        payload = thrownTest.payload;

        // Act.
        result = () => checkPayloadValidity(payload);

        // Assert.
        expect(result).toThrowError(SyntaxError, thrownTest.error);
        expect(console.log).toHaveBeenCalledWith('checkPayloadValidity', payload);
      });
    });
  });
});
