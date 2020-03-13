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
      console.log  = jasmine.createSpy('log');
      methodArn    = 'arn:aws:execute-api:us-east-1:123456789012:a1b2c3d4e5/dev/GET/some/path';
      errorMessage = 'Decoded authorization token is incorrectly formatted';
    });

    /**
     * If in payload, "id" is a number and "type" is a string, a policy should be returned.
     *
     * @since 1.0.0
     */
    it('If in payload, "id" is a number and "type" is a string, a policy should be returned', () => {
      // Arrange.
      payload = {
        id: 99999,
        type: 'something',
      };
      logged  = {
        thePayload: payload,
        methodArn,
      };
      policy  = {
        principalId: 'something-99999',
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
     * If in payload, "id" is not a number and "type" is not a string, an error should be thrown.
     *
     * @since 1.0.0
     */
    it('If in payload, "id" is not a number and "type" is not a string, an error should be thrown', () => {
      // Arrange.
      payload = {
        id: '99999',
        type: true,
      };
      logged  = {
        thePayload: payload,
        methodArn,
      };

      // Act.
      result = () => generatePolicy(payload, methodArn);

      // Assert.
      expect(result).toThrowError(SyntaxError, errorMessage);
      expect(console.log).toHaveBeenCalledWith('generatePolicy', logged);
    });

    /**
     * If in payload, "id" is not a number, an error should be thrown.
     *
     * @since 1.0.0
     */
    it('If in payload, "id" is not a number, an error should be thrown', () => {
      // Arrange.
      payload = {
        id: '99999',
        type: 'something',
      };
      logged  = {
        thePayload: payload,
        methodArn,
      };

      // Act.
      result = () => generatePolicy(payload, methodArn);

      // Assert.
      expect(result).toThrowError(SyntaxError, errorMessage);
      expect(console.log).toHaveBeenCalledWith('generatePolicy', logged);
    });

    /**
     * If in payload, "type" is not a string, an error should be thrown.
     *
     * @since 1.0.0
     */
    it('If in payload, "type" is not a string, an error should be thrown', () => {
      // Arrange.
      payload = {
        id: 99999,
        type: true,
      };
      logged  = {
        thePayload: payload,
        methodArn,
      };

      // Act.
      result = () => generatePolicy(payload, methodArn);

      // Assert.
      expect(result).toThrowError(SyntaxError, errorMessage);
      expect(console.log).toHaveBeenCalledWith('generatePolicy', logged);
    });

    /**
     * If in payload, is empty, an error should be thrown.
     *
     * @since 1.0.0
     */
    it('If in payload, is empty, an error should be thrown', () => {
      // Arrange.
      payload = {};
      logged  = {
        thePayload: payload,
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
