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
      type: 'something',
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
     * If token and payload is valid, a policy should be returned.
     *
     * @since 1.0.0
     */
    it('If token and payload is valid, a policy should be returned', () => {
      // Arrange.
      authToken = authEvent.authorizationToken;
      logUserAuth = {
        payload,
        methodArn: authEvent.methodArn,
      };
      policy = {
        principalId: '{"type":"something","ip":"1.1.1.1","ua":"chrome","iat":99999,"exp":99999}',
        policyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Action: [
                'execute-api:Invoke',
              ],
              Resource: [
                'arn:aws:execute-api:us-east-1:123456789012:a1b2c3d4e5/dev/*',
              ],
            },
          ],
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
      expect(callback).toHaveBeenCalledWith(null, policy);
      expect(result).toBeUndefined();
    });
  });

  /**
   * Checks for invalid token format.
   *
   * @since 1.0.0
   */
  describe('Checks for invalid token format', () => {
    /**
     * Define tests.
     *
     * @since 1.0.0
     */
    const invalidTokens = [
      {
        name: 'invalid format, no Bearer',
        token: 'Abc-1234_5678+=.Abc-1234_5678+=.Abc-1234_5678+=',
      },
      {
        name: 'invalid format, with Bearer',
        token: 'Bearer Abc-1234_5678+=.Abc-1234_5678+=.Abc-1234_5678+=',
      },
      {
        name: 'valid format, no Bearer',
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
    invalidTokens.forEach((invalidToken) => {
      /**
       * If token is invalid (${invalidToken.name}), an error should be thrown.
       *
       * @since 1.0.0
       */
      it(`If token is invalid (${invalidToken.name}), an error should be thrown`, () => {
        // Arrange.
        authEvent.authorizationToken = invalidToken.token;
        errorObject = new SyntaxError('Authentication token is incorrectly formatted');

        spyOn(jwt, 'verify').and.returnValue(payload);

        // Act.
        result = authChecker(authEvent, lambdaContext, callback);

        // Assert.
        expect(console.log).toHaveBeenCalledWith('checkTokenFormat', authEvent.authorizationToken);
        expect(console.log).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith('authChecker', errorObject);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith('Unauthorized');
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
    const invalidPayloads = [
      {
        name: 'payload is undefined',
        payload: undefined,
        errMsg: 'The payload is empty or invalid',
        empty: true,
      },
      {
        name: 'payload is boolean',
        payload: true,
        errMsg: 'The payload is empty or invalid',
        empty: true,
      },
      {
        name: 'payload is an empty object',
        payload: {},
        errMsg: 'The payload is empty or invalid',
        empty: true,
      },
      {
        name: 'payload is an empty array',
        payload: [],
        errMsg: 'The payload is empty or invalid',
        empty: true,
      },
      {
        name: 'payload is a filled array',
        payload: [
          {
            hello: 'world',
          },
        ],
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
        name: '"type" key is boolean',
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
        name: '"type" key is an empty string',
        payload: {
          type: '',
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
          type: 'something',
          ua: 'chrome',
          iat: 99999,
          exp: 99999,
        },
        errMsg: 'The "ip" key is empty or not a string',
        empty: false,
      },
      {
        name: '"ip" key is boolean',
        payload: {
          type: 'something',
          ip: true,
          ua: 'chrome',
          iat: 99999,
          exp: 99999,
        },
        errMsg: 'The "ip" key is empty or not a string',
        empty: false,
      },
      {
        name: '"ip" key is an empty string',
        payload: {
          type: 'something',
          ip: '',
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
          type: 'something',
          ip: '1.1.1.1',
          iat: 99999,
          exp: 99999,
        },
        errMsg: 'The "ua" key is empty or not a string',
        empty: false,
      },
      {
        name: '"ua" key is boolean',
        payload: {
          type: 'something',
          ip: '1.1.1.1',
          ua: true,
          iat: 99999,
          exp: 99999,
        },
        errMsg: 'The "ua" key is empty or not a string',
        empty: false,
      },
      {
        name: '"ua" key is an empty string',
        payload: {
          type: 'something',
          ip: '1.1.1.1',
          ua: '',
          iat: 99999,
          exp: 99999,
        },
        errMsg: 'The "ua" key is empty or not a string',
        empty: false,
      },
      {
        name: '"iat" key is undefined',
        payload: {
          type: 'something',
          ip: '1.1.1.1',
          ua: 'chrome',
          exp: 99999,
        },
        errMsg: 'The "iat" key is not a finite number',
        empty: false,
      },
      {
        name: '"iat" key is NaN',
        payload: {
          type: 'something',
          ip: '1.1.1.1',
          ua: 'chrome',
          iat: NaN,
          exp: 99999,
        },
        errMsg: 'The "iat" key is not a finite number',
        empty: false,
      },
      {
        name: '"iat" key is Infinity',
        payload: {
          type: 'something',
          ip: '1.1.1.1',
          ua: 'chrome',
          iat: Infinity,
          exp: 99999,
        },
        errMsg: 'The "iat" key is not a finite number',
        empty: false,
      },
      {
        name: '"iat" key is -Infinity',
        payload: {
          type: 'something',
          ip: '1.1.1.1',
          ua: 'chrome',
          iat: -Infinity,
          exp: 99999,
        },
        errMsg: 'The "iat" key is not a finite number',
        empty: false,
      },
      {
        name: '"exp" key is undefined',
        payload: {
          type: 'something',
          ip: '1.1.1.1',
          ua: 'chrome',
          iat: 99999,
        },
        errMsg: 'The "exp" key is not a finite number',
        empty: false,
      },
      {
        name: '"exp" key is NaN',
        payload: {
          type: 'something',
          ip: '1.1.1.1',
          ua: 'chrome',
          iat: 99999,
          exp: NaN,
        },
        errMsg: 'The "exp" key is not a finite number',
        empty: false,
      },
      {
        name: '"exp" key is Infinity',
        payload: {
          type: 'something',
          ip: '1.1.1.1',
          ua: 'chrome',
          iat: 99999,
          exp: Infinity,
        },
        errMsg: 'The "exp" key is not a finite number',
        empty: false,
      },
      {
        name: '"exp" key is -Infinity',
        payload: {
          type: 'something',
          ip: '1.1.1.1',
          ua: 'chrome',
          iat: 99999,
          exp: -Infinity,
        },
        errMsg: 'The "exp" key is not a finite number',
        empty: false,
      },
    ];

    /**
     * Run tests.
     *
     * @since 1.0.0
     */
    invalidPayloads.forEach((invalidPayload) => {
      /**
       * If payload is invalid (${invalidPayload.name}), an error should be thrown.
       *
       * @since 1.0.0
       */
      it(`If payload is invalid (${invalidPayload.name}), an error should be thrown`, () => {
        // Arrange.
        payload = invalidPayload.payload;
        errorObject = new SyntaxError(invalidPayload.errMsg);

        spyOn(jwt, 'verify').and.returnValue(payload);

        // Act.
        result = authChecker(authEvent, lambdaContext, callback);

        // Assert.
        expect(console.log).toHaveBeenCalledWith('checkTokenFormat', authEvent.authorizationToken);
        expect(console.log).toHaveBeenCalledWith('checkPayloadIfEmpty', payload);

        if (invalidPayload.empty) {
          expect(console.log).toHaveBeenCalledTimes(2);
        } else {
          expect(console.log).toHaveBeenCalledWith('checkPayloadIfValid', payload);
          expect(console.log).toHaveBeenCalledTimes(3);
        }

        expect(console.error).toHaveBeenCalledWith('authChecker', errorObject);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith('Unauthorized');
        expect(result).toBeUndefined();
      });
    });
  });
});
