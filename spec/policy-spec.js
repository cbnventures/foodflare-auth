const { generatePolicy } = require('../src/config/policy');

/**
 * Generate policy.
 *
 * @since 1.0.0
 */
describe('Generate policy', () => {
  /**
   * While generating policy.
   *
   * @since 1.0.0
   */
  describe('While generating policy', () => {
    let methodArn;
    let errorMessage;
    let payload;
    let logged;
    let policy;
    let result;

    /**
     * Before each test.
     *
     * @since 1.0.0
     */
    beforeEach(() => {
      console.log = jasmine.createSpy('log');
      methodArn = 'arn:aws:execute-api:us-east-1:123456789012:a1b2c3d4e5/dev/GET/some/path';
      errorMessage = 'The payload is incorrectly formatted';
    });

    /**
     * If in payload, is correct, a policy should be returned.
     *
     * @since 1.0.0
     */
    it('If in payload, is correct, a policy should be returned', () => {
      // Arrange.
      payload = {
        type: 'app',
        ip: '1.1.1.1',
        ua: 'chrome',
      };
      logged = {
        payload,
        methodArn,
      };
      policy = {
        principalId: '{"type":"app","ip":"1.1.1.1","ua":"chrome"}',
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

      // Act.
      result = generatePolicy(payload, methodArn);

      // Assert.
      expect(console.log).toHaveBeenCalledWith('generatePolicy', logged);
      expect(result).toEqual(policy);
    });

    /**
     * Thrown tests define.
     *
     * @since 1.0.0
     */
    const thrownTests = [
      {
        is: 'missing "type"',
        payload: {
          ip: '1.1.1.1',
          ua: 'chrome',
        },
      },
      {
        is: 'missing "ip"',
        payload: {
          type: 'app',
          ua: 'chrome',
        },
      },
      {
        is: 'missing "ua"',
        payload: {
          type: 'app',
          ip: '1.1.1.1',
        },
      },
      {
        is: 'empty',
        payload: {},
      },
    ];

    /**
     * Thrown tests for each.
     *
     * @since 1.0.0
     */
    thrownTests.forEach((thrownTest) => {
      /**
       * If in payload, is {thrownTest.is}, an error should be thrown.
       *
       * @since 1.0.0
       */
      it(`If in payload, is ${thrownTest.is}, an error should be thrown`, () => {
        // Arrange.
        payload = thrownTest.payload;
        logged = {
          payload,
          methodArn,
        };

        // Act.
        result = () => generatePolicy(payload, methodArn);

        // Assert.
        expect(result).toThrowError(SyntaxError, errorMessage);
        expect(console.log).toHaveBeenCalledWith('generatePolicy', logged);
      });
    });
  });
});
