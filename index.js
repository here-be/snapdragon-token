'use strict';

/**
 * Create a new `Token` with the given `value` and `type`.
 *
 * ```js
 * const token = new Token('*', 'Star');
 * const token = new Token({type: 'star', value: '*'});
 * console.log(token) //=> Token { type: 'star', value: '*' }
 * ```
 * @name Token
 * @param {String|Object} `type` The token type to use when `value` is a string.
 * @param {String} `value` Value to set
 * @return {Object} Token instance
 * @api public
 */

class Token {
  constructor(type, value, match) {
    if (Array.isArray(value)) {
      match = value;
      value = type.value || match[0];
    }

    if (isObject(type)) {
      for (const key in type) {
        this[key] = type[key];
      }
    } else {
      this.type = type;
      this.value = value;
    }

    if (match) {
      this.match = match;
    }
  }

  get isToken() {
    return true;
  }

  static isToken(token) {
    return isObject(token) && token.isToken === true;
  }
}

function isObject(val) {
  return val && typeof val === 'object' && !Array.isArray(val);
}

module.exports = Token;
