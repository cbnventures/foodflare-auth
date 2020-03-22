const jwt = require('jsonwebtoken');

const { authChecker } = require('../index');

/**
 * Auth checker.
 *
 * @since 1.0.0
 */
describe('Auth checker', () => {
  let lambdaContext;
  let callback;
  let authEvent;
  let payload;
  let errorObject;
  let result;

  /**
   * Before each test.
   *
   * @since 1.0.0
   */
  beforeEach(() => {
    // Tracked/spied functions.
    console.error = jasmine.createSpy('error');
    console.log = jasmine.createSpy('log');
    lambdaContext = jasmine.createSpyObj('lambdaContext', ['done']);
    callback = jasmine.createSpy('callback').and.callFake((failed, success) => failed || success);

    // The auth event.
    authEvent = {
      type: 'TOKEN',
      methodArn: 'arn:aws:execute-api:us-east-1:123456789012:a1b2c3d4e5/dev/GET/some/path',
      authorizationToken: 'Bearer Abc-1234_5678.Abc-1234_5678.Abc-1234_5678',
    };

    // Payload.
    payload = {
      type: 'app',
      ip: '1.1.1.1',
      ua: 'chrome',
      iat: 99999,
      exp: 99999,
    };
  });

  /**
   * Checks for successful authorization.
   *
   * @since 1.0.0
   */
  describe('Checks for successful authorization', () => {
    let authToken;
    let logUserAuth;
    let policy;

    /**
     * If token and payload is correct, a policy should be returned.
     *
     * @since 1.0.0
     */
    it('If token and payload is correct, a policy should be returned', () => {
      // Arrange.
      authToken = authEvent.authorizationToken;
      logUserAuth = {
        payload,
        methodArn: authEvent.methodArn,
      };
      policy = {
        principalId: '{"type":"app","ip":"1.1.1.1","ua":"chrome","iat":99999,"exp":99999}',
        policyDocument: {
          Version: '2012-10-17',
          Statement: [{
            Effect: 'Allow',
            Action: [
              'execute-api:Invoke',
            ],
            Resource: [
              'arn:aws:execute-api:us-east-1:123456789012:a1b2c3d4e5/dev/*',
            ],
          }],
        },
      };

      spyOn(jwt, 'verify').and.returnValue(payload);

      // Act.
      result = authChecker(authEvent, lambdaContext, callback);

      // Assert.
      expect(console.log).toHaveBeenCalledWith('checkTokenFormat', authToken);
      expect(console.log).toHaveBeenCalledWith('checkPayloadIfEmpty', payload);
      expect(console.log).toHaveBeenCalledWith('checkPayloadIfValid', payload);
      expect(console.log).toHaveBeenCalledWith('generatePolicy', logUserAuth);
      expect(console.log).toHaveBeenCalledWith('authChecker', authEvent);
      expect(console.log).toHaveBeenCalledTimes(5);
      expect(console.error).not.toHaveBeenCalled();
      expect(callback.calls.first().returnValue).toEqual(policy);
      expect(result).toBeUndefined();
    });
  });

  /**
   * Checks for wrong token format.
   *
   * @since 1.0.0
   */
  describe('Checks for wrong token format', () => {
    /**
     * Define tests.
     *
     * @since 1.0.0
     */
    const wrongTokens = [
      {
        name: 'wrong format, no Bearer',
        token: 'Abc-1234_5678+=.Abc-1234_5678+=.Abc-1234_5678+=',
      },
      {
        name: 'wrong format, with Bearer',
        token: 'Bearer Abc-1234_5678+=.Abc-1234_5678+=.Abc-1234_5678+=',
      },
      {
        name: 'correct format, no Bearer',
        token: 'Abc-1234_5678.Abc-1234_5678.Abc-1234_5678',
      },
      {
        name: 'no token provided',
        token: '',
      },
    ];

    /**
     * Run tests.
     *
     * @since 1.0.0
     */
    wrongTokens.forEach((wrongToken) => {
      /**
       * If token is invalid (${wrongToken.name}), an error should be thrown.
       *
       * @since 1.0.0
       */
      it(`If token is invalid (${wrongToken.name}), an error should be thrown`, () => {
        // Arrange.
        authEvent.authorizationToken = wrongToken.token;
        errorObject = new SyntaxError('Authentication token is incorrectly formatted');

        spyOn(jwt, 'verify').and.returnValue(payload);

        // Act.
        result = authChecker(authEvent, lambdaContext, callback);

        // Assert.
        expect(console.log).toHaveBeenCalledWith('checkTokenFormat', authEvent.authorizationToken);
        expect(console.log).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith('authChecker', errorObject);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(callback.calls.first().returnValue).toEqual('Unauthorized');
        expect(result).toBeUndefined();
      });
    });
  });

  /**
   * Checks for invalid payload.
   *
   * @since 1.0.0
   */
  describe('Checks for invalid payload', () => {
    /**
     * Define tests.
     *
     * @since 1.0.0
     */
    const wrongPayloads = [
      {
        name: 'empty',
        payload: {},
        errMsg: 'The payload is empty or invalid',
        empty: true,
      },
      {
        name: 'not an object',
        payload: true,
        errMsg: 'The payload is empty or invalid',
        empty: true,
      },
      {
        name: '"type" key is undefined',
        payload: {
          ip: '1.1.1.1',
          ua: 'chrome',
          iat: 99999,
          exp: 99999,
        },
        errMsg: 'The "type" key is empty or not a string',
        empty: false,
      },
      {
        name: '"type" key is not a string',
        payload: {
          type: true,
          ip: '1.1.1.1',
          ua: 'chrome',
          iat: 99999,
          exp: 99999,
        },
        errMsg: 'The "type" key is empty or not a string',
        empty: false,
      },
      {
        name: '"ip" key is undefined',
        payload: {
          type: 'app',
          ua: 'chrome',
          iat: 99999,
          exp: 99999,
        },
        errMsg: 'The "ip" key is empty or not a string',
        empty: false,
      },
      {
        name: '"ip" key is not a string',
        payload: {
          type: 'app',
          ip: true,
          ua: 'chrome',
          iat: 99999,
          exp: 99999,
        },
        errMsg: 'The "ip" key is empty or not a string',
        empty: false,
      },
      {
        name: '"ua" key is undefined',
        payload: {
          type: 'app',
          ip: '1.1.1.1',
          iat: 99999,
          exp: 99999,
        },
        errMsg: 'The "ua" key is empty or not a string',
        empty: false,
      },
      {
        name: '"ua" key is not a string',
        payload: {
          type: 'app',
          ip: '1.1.1.1',
          ua: true,
          iat: 99999,
          exp: 99999,
        },
        errMsg: 'The "ua" key is empty or not a string',
        empty: false,
      },
      {
        name: '"iat" key is not a number',
        payload: {
          type: 'app',
          ip: '1.1.1.1',
          ua: 'chrome',
          iat: true,
          exp: 99999,
        },
        errMsg: 'The "iat" key is not a number',
        empty: false,
      },
      {
        name: '"exp" key is not a number',
        payload: {
          type: 'app',
          ip: '1.1.1.1',
          ua: 'chrome',
          iat: 99999,
          exp: true,
        },
        errMsg: 'The "exp" key is not a number',
        empty: false,
      },
    ];

    /**
     * Run tests.
     *
     * @since 1.0.0
     */
    wrongPayloads.forEach((wrongPayload) => {
      /**
       * If payload is invalid (${wrongPayload.name}), an error should be thrown.
       *
       * @since 1.0.0
       */
      it(`If payload is invalid (${wrongPayload.name}), an error should be thrown`, () => {
        // Arrange.
        payload = wrongPayload.payload;
        errorObject = new SyntaxError(wrongPayload.errMsg);

        spyOn(jwt, 'verify').and.returnValue(payload);

        // Act.
        result = authChecker(authEvent, lambdaContext, callback);

        // Assert.
        expect(console.log).toHaveBeenCalledWith('checkTokenFormat', authEvent.authorizationToken);
        expect(console.log).toHaveBeenCalledWith('checkPayloadIfEmpty', payload);

        if (wrongPayload.empty) {
          expect(console.log).toHaveBeenCalledTimes(2);
        } else {
          expect(console.log).toHaveBeenCalledWith('checkPayloadIfValid', payload);
          expect(console.log).toHaveBeenCalledTimes(3);
        }

        expect(console.error).toHaveBeenCalledWith('authChecker', errorObject);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(callback.calls.first().returnValue).toEqual('Unauthorized');
        expect(result).toBeUndefined();
      });
    });
  });
});
