const jwt = require('jsonwebtoken');

const { authChecker } = require('../index');

/**
 * Authorization checker.
 *
 * @since 1.0.0
 */
describe('Authorization checker', () => {
  /**
   * While authenticating.
   *
   * @since 1.0.0
   */
  describe('While authenticating', () => {
    let lambdaContext;
    let callback;
    let authEvent;
    let policy;
    let result;

    /**
     * Before each test.
     *
     * @since 1.0.0
     */
    beforeEach(() => {
      console.error = jasmine.createSpy('error');
      console.log   = jasmine.createSpy('log');
      lambdaContext = jasmine.createSpyObj('lambdaContext', ['done']);
      callback      = jasmine.createSpy('callback').and.callFake((failed, success) => failed || success);
    });

    /**
     * If token and payload is correct, a policy should be returned.
     *
     * @since 1.0.0
     */
    it('If token and payload is correct, a policy should be returned', () => {
      // Arrange.
      authEvent = {
        type: 'TOKEN',
        methodArn: 'arn:aws:execute-api:us-east-1:123456789012:a1b2c3d4e5/dev/GET/some/path',
        authorizationToken: 'Bearer Abc-1234_5678.Abc-1234_5678.Abc-1234_5678',
      };
      policy    = {
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

      spyOn(jwt, 'verify').and.returnValue({
        id: 99999,
        type: 'something',
      });

      // Act.
      result = authChecker(authEvent, lambdaContext, callback);

      // Assert.
      expect(console.log).toHaveBeenCalledWith('authChecker', authEvent);
      expect(console.error).not.toHaveBeenCalled();
      expect(callback.calls.first().returnValue).toEqual(policy);
      expect(result).toBeUndefined();
    });
  });
});
