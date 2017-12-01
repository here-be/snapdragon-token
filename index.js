'use strict';

const typeOf = require('kind-of');
const define = require('define-property');

/**
 * Create a new `Token` with the given `val` and `type`.
 *
 * ```js
 * const token = new Token('*', 'Star');
 * const token = new Token({type: 'star', val: '*'});
 * console.log(token) //=> Token { type: 'star', val: '*' }
 * ```
 * @param {String|Object} `type` The token type to use when `val` is a string.
 * @param {String} `val` Value to set
 * @return {Object} Token instance
 * @api public
 */

class Token {
  constructor(type, val, match) {
    define(this, 'isToken', true);

    if (Array.isArray(val)) {
      match = val;
      val = type.val || match[0];
    }

    if (typeOf(type) === 'object') {
      for (let key in type) this[key] = type[key];
    } else {
      this.type = type;
      this.val = val;
    }

    if (match) {
      this.match = match;
    }
  }

  static isToken(token) {
    return token && token.isToken === true;
  }
}

/**
 * Expose `Token` class
 */

module.exports = Token;
