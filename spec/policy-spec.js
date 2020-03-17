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
        iat: 99999,
        exp: 99999,
      };
      logged = {
        payload,
        methodArn,
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

      // Act.
      result = generatePolicy(payload, methodArn);

      // Assert.
      expect(console.log).toHaveBeenCalledWith('generatePolicy', logged);
      expect(result).toEqual(policy);
    });
  });
});
