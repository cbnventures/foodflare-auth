/**
 * Generate policy.
 *
 * @param {Payload} thePayload - Decoded authorization token.
 * @param {string}  methodArn  - Amazon Web Services resource name.
 *
 * @returns {PolicyResponse}
 *
 * @since 1.0.0
 */
function generatePolicy(thePayload, methodArn) {
  const { id, type } = thePayload;

  const theArn    = methodArn.split(/[:/]/);
  const region    = theArn[3];
  const accountId = theArn[4];
  const restApiId = theArn[5];
  const stage     = theArn[6];

  console.log('generatePolicy', {
    thePayload,
    methodArn,
  });

  if (typeof id !== 'number' || typeof type !== 'string') {
    throw new SyntaxError('Decoded authorization token is incorrectly formatted');
  }

  return {
    principalId: `${type}-${id}`,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [{
        Effect: 'Allow',
        Action: [
          'execute-api:Invoke',
        ],
        Resource: [
          `arn:aws:execute-api:${region}:${accountId}:${restApiId}/${stage}/*`,
        ],
      }],
    },
  };
}

exports.generatePolicy = generatePolicy;
