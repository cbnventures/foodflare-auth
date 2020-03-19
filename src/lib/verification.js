const _ = require('lodash');

/**
 * Check authorization token format.
 *
 * @param {string} authToken - Authorization token.
 *
 * @returns {string}
 *
 * @since 1.0.0
 */
function checkTokenFormat(authToken) {
  const regex = /^(Bearer )([A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+)$/;

  console.log('checkTokenFormat', authToken);

  if (regex.test(authToken)) {
    return authToken.replace(regex, '$2');
  }

  throw new SyntaxError('Authentication token is incorrectly formatted');
}

/**
 * Check payload if valid.
 *
 * @param {Payload} payload - The payload.
 *
 * @returns {Payload}
 *
 * @since 1.0.0
 */
function checkPayloadIfValid(payload) {
  const {
    type,
    ip,
    ua,
    iat,
    exp,
  } = payload;

  console.log('checkPayloadIfValid', payload);

  if (
    _.isEmpty(type)
    || _.isEmpty(ip)
    || _.isEmpty(ua)
    || !_.isNumber(iat)
    || !_.isNumber(exp)
  ) {
    throw new SyntaxError('The payload is empty or invalid');
  }

  return payload;
}

exports.checkTokenFormat = checkTokenFormat;
exports.checkPayloadIfValid = checkPayloadIfValid;
