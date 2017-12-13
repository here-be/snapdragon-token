'use strict';

const typeOf = require('kind-of');

function create(options) {
  const opts = Object.assign({value: 'value'}, options);

  /**
   * Create a new `Token` with the given `value` and `type`.
   *
   * ```js
   * const token = new Token('*', 'Star');
   * const token = new Token({type: 'star', value: '*'});
   * console.log(token) //=> Token { type: 'star', value: '*' }
   * ```
   * @param {String|Object} `type` The token type to use when `value` is a string.
   * @param {String} `value` Value to set
   * @return {Object} Token instance
   * @api public
   */

  class Token {
    constructor(type, value, match) {
      Reflect.defineProperty(this, 'isToken', {writable: true, value: true});

      if (Array.isArray(value)) {
        match = value;
        value = type[opts.value] || match[0];
      }

      if (typeOf(type) === 'object') {
        for (let key in type) this[key] = type[key];
      } else {
        this.type = type;
        this[opts.value] = value;
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

  return Token;
};

module.exports = create();
module.exports.create = create;
