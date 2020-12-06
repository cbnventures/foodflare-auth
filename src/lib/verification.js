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
 * Check payload if empty.
 *
 * @param {Payload} payload - The payload.
 *
 * @returns {Payload}
 *
 * @since 1.0.0
 */
function checkPayloadIfEmpty(payload) {
  console.log('checkPayloadIfEmpty', payload);

  if (_.isEmpty(payload) || !_.isPlainObject(payload)) {
    throw new SyntaxError('The payload is empty or invalid');
  }

  return payload;
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
    platform,
    ip,
    ua,
    iat,
    exp,
  } = payload;

  console.log('checkPayloadIfValid', payload);

  if (_.isEmpty(platform) || !_.isString(platform)) {
    throw new SyntaxError('The "platform" value is empty or not a string');
  }

  if (_.isEmpty(ip) || !_.isString(ip)) {
    throw new SyntaxError('The "ip" value is empty or not a string');
  }

  if (_.isEmpty(ua) || !_.isString(ua)) {
    throw new SyntaxError('The "ua" value is empty or not a string');
  }

  if (!_.isFinite(iat)) {
    throw new SyntaxError('The "iat" value is not a finite number');
  }

  if (!_.isFinite(exp)) {
    throw new SyntaxError('The "exp" value is not a finite number');
  }

  return payload;
}

module.exports = {
  checkTokenFormat,
  checkPayloadIfEmpty,
  checkPayloadIfValid,
};
