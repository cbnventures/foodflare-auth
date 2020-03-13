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

exports.checkTokenFormat = checkTokenFormat;
