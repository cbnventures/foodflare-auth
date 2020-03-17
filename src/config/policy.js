const _ = require('lodash');

/**
 * Generate policy.
 *
 * @param {Payload} payload    - The payload.
 * @param {string}  methodArn  - Amazon Web Services resource name.
 *
 * @returns {PolicyResponse}
 *
 * @since 1.0.0
 */
function generatePolicy(payload, methodArn) {
  const { type, ip, ua } = payload;

  const arn = methodArn.split(/[:/]/);
  const arnRegion = arn[3];
  const arnAccountId = arn[4];
  const arnRestApiId = arn[5];
  const arnStage = arn[6];

  console.log('generatePolicy', {
    payload,
    methodArn,
  });

  if (
    _.isEmpty(payload)
    || _.isEmpty(type)
    || _.isEmpty(ip)
    || _.isEmpty(ua)
  ) {
    throw new SyntaxError('The payload is incorrectly formatted');
  }

  return {
    principalId: JSON.stringify(payload),
    policyDocument: {
      Version: '2012-10-17',
      Statement: [{
        Effect: 'Allow',
        Action: [
          'execute-api:Invoke',
        ],
        Resource: [
          `arn:aws:execute-api:${arnRegion}:${arnAccountId}:${arnRestApiId}/${arnStage}/*`,
        ],
      }],
    },
  };
}

exports.generatePolicy = generatePolicy;
