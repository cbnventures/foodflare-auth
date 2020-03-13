const dotenv = require('dotenv');
const fs     = require('fs');
const jwt    = require('jsonwebtoken');

const { generatePolicy }   = require('./src/config/policy');
const { checkTokenFormat } = require('./src/lib/verification');

dotenv.config();

/**
 * Authorization checker.
 *
 * @param {AuthEvent}    event    - API Gateway custom authorizer event.
 * @param {AuthContext}  context  - Amazon Web Services Lambda context object.
 * @param {AuthCallback} callback - Callback function.
 *
 * @since 1.0.0
 */
function authChecker(event, context, callback) {
  const { authorizationToken, methodArn } = event;
  const { JWT_ALGORITHM, JWT_MAX_AGE }    = process.env;

  try {
    const cleanedAuth = checkTokenFormat(authorizationToken);
    const publicKey   = fs.readFileSync(`${__dirname}/certs/public.pem`);
    const decodedBody = jwt.verify(cleanedAuth, publicKey, {
      algorithms: [JWT_ALGORITHM],
      maxAge: JWT_MAX_AGE,
    });
    const arnPolicy   = generatePolicy(decodedBody, methodArn);

    console.log('authChecker', event);

    callback(null, arnPolicy);
  } catch (error) {
    console.error('authChecker', error);

    callback('Unauthorized');
  }
}

exports.authChecker = authChecker;
