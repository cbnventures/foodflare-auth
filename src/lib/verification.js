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

  if (!regex.test(authToken)) {
    throw new SyntaxError('Authentication token is incorrectly formatted');
  }

  return authToken.replace(regex, '$2');
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

  if (_.isEmpty(payload) || !_.isObject(payload)) {
    throw new SyntaxError('The payload is empty or invalid');
  }

  if (_.isEmpty(type) || !_.isString(type)) {
    throw new SyntaxError('The payload "type" key is empty or not a string');
  }

  if (_.isEmpty(ip) || !_.isString(ip)) {
    throw new SyntaxError('The payload "ip" key is empty or not a string');
  }

  if (_.isEmpty(ua) || !_.isString(ua)) {
    throw new SyntaxError('The payload "ua" key is empty or not a string');
  }

  if (!_.isNumber(iat)) {
    throw new SyntaxError('The payload "iat" key is not a number');
  }

  if (!_.isNumber(exp)) {
    throw new SyntaxError('The payload "exp" key is not a number');
  }

  return payload;
}

exports.checkTokenFormat = checkTokenFormat;
exports.checkPayloadIfValid = checkPayloadIfValid;
