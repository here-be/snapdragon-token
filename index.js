'use strict';

var define = require('define-property');
var typeOf = require('kind-of');

/**
 * Create a new `Token` with the given `val` and `type`.
 *
 * ```js
 * var token = new Token('*', 'Star');
 * var token = new Token({type: 'star', val: '*'});
 * ```
 * @param {String|Object} `val` Value to set
 * @param {String} `type` The token type to use when `val` is a string.
 * @param {Object} `parent` Object with `tokens` array or Lexer instance
 * @param {Arguments} `match` Arguments from regex `.exec`
 * @return {Object} token instance
 * @api public
 */

function Token(type, val, match, parent) {
  if (typeOf(type) === 'object') {
    var tok = new this.constructor(type.type, type.val, val, parent);
    return Object.assign(tok, type);
  }

  if (typeOf(match) === 'object') {
    let temp = parent;
    parent = match;
    match = temp;
    temp = null;
  }

  define(this, 'isToken', true);
  define(this, 'parent', parent);
  define(this, 'match', match);
  define(this, 'cache', {});
  this.type = type;
  this.val = val;
}

/**
 * Static method that returns true if the given value is an
 * instance of snapdragon-token, or is an object with
 * `isToken=true`.
 *
 * ```js
 * var Token = require('snapdragon-token');
 * console.log(Token.isToken(new Token({type: 'foo'}))); //=> true
 * console.log(Token.isToken({isToken: true})); //=> true
 * console.log(Token.isToken({})); //=> false
 * ```
 * @name Token#isToken
 * @param {Object} `token`
 * @returns {Boolean}
 * @static
 * @api public
 */

Token.isToken = function(token) {
  return typeOf(token) === 'object' && token.isToken === true;
};

/**
 * Returns the `lexer.tokens` array if a Lexer was either passed
 * to the Token constructor when instantiating, or set on
 * `token.parent` after instantiating.
 *
 * ```js
 * var Lexer = require('snapdragon-lexer');
 * var lexer = new Lexer();
 * var foo = new Token('star', '*', lexer);
 * console.log(foo.siblings === lexer.tokens);
 * //=> true
 * ```
 * @name .siblings
 * @return {Array|undefined}
 * @api public
 */

Object.defineProperty(Token.prototype, 'siblings', {
  get: function() {
    return this.parent ? this.parent.tokens : undefined;
  }
});

/**
 * Returns the correct index of the token from the [siblings](#siblings)
 * array, or `-1` if `token.siblings` is undefined or the token does
 * not exist on `token.siblings`.
 *
 * ```js
 * var Lexer = require('snapdragon-lexer');
 * var lexer = new Lexer();
 *
 * var slash = new Token('slash', '/', lexer);
 * var star = new Token('star', '*', lexer);
 * var dot = new Token('dot', '.', lexer);
 * console.log(slash.index) //=> -1
 * console.log(star.index) //=> -1
 * console.log(dot.index) //=> -1
 *
 * lexer.tokens.push(slash);
 * console.log(slash.index) //=> 0
 *
 * lexer.tokens.push(star);
 * console.log(star.index) //=> 1
 *
 * lexer.tokens.unshift(dot);
 * console.log(slash.index) //=> 1
 * console.log(star.index) //=> 2
 * console.log(dot.index) //=> 0
 * ```
 * @name .index
 * @return {Object}
 * @api public
 */

Object.defineProperty(Token.prototype, 'index', {
  set: function(index) {
    define(this, 'idx', index);
  },
  get: function() {
    if (!Array.isArray(this.siblings)) {
      return -1;
    }
    var tok = this.idx != null ? this.siblings[this.idx] : null;
    if (tok !== this) {
      this.idx = this.siblings.indexOf(this);
    }
    return this.idx;
  }
});

/**
 * Get the string length of `token.val`
 *
 * ```js
 * var token = new Token({type: 'slash', val: '//'});
 * console.log(token.length);
 * //=> 2
 *
 * var token = new Token({type: 'eos', val: undefined});
 * console.log(token.length); // end-of-string
 * //=> 0
 * ```
 * @name .length
 * @return {Number}
 * @api public
 */

Object.defineProperty(Token.prototype, 'length', {
  get: function() {
    return typeof this.val === 'string' ? this.val.length : 0;
  }
});

/**
 * Get the previous token from the `token.siblings` array.
 *
 * ```js
 * var Lexer = require('snapdragon-lexer');
 * var lexer = new Lexer();
 * var slash = new Token('slash', '/', lexer);
 * var star = new Token('star', '*', lexer);
 * lexer.tokens.push(slash);
 * lexer.tokens.push(star);
 * console.log(slash.prev) //=> undefined
 * console.log(star.prev) //=> Token { type: 'slash', val: '/' }
 * ```
 * @name .prev
 * @return {Object|undefined} Returns the previous token is one exists.
 * @api public
 */

Object.defineProperty(Token.prototype, 'prev', {
  get: function() {
    return this.siblings[this.index - 1];
  }
});

/**
 * Get the next token from the [siblings](#siblings) array.
 *
 * ```js
 * var Lexer = require('snapdragon-lexer');
 * var lexer = new Lexer();
 * var slash = new Token('slash', '/', lexer);
 * var star = new Token('star', '*', lexer);
 * lexer.tokens.push(slash);
 * lexer.tokens.push(star);
 * console.log(slash.next) //=> Token { type: 'star', val: '*' }
 * console.log(star.next) //=> undefined
 * ```
 * @name .next
 * @return {Object|undefined} Returns the next token if one exists.
 * @api public
 */

Object.defineProperty(Token.prototype, 'next', {
  get: function() {
    var tok = this.siblings[this.index + 1];
    if (tok) return tok;

    if (this.parent && this.parent.peek) {
      return this.parent.peek();
    }
  }
});

/**
 * Expose `Token`
 */

exports = module.exports = Token;
