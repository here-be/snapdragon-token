'use strict';

require('mocha');
const assert = require('assert');
const Token = require('..');

// mock lexer
class Lexer {
  constructor() {
    this.isLexer = true;
    this.tokens = [];
  }
  push(tok) {
    tok.parent = this;
    this.tokens.push(tok);
  }
  unshift(tok) {
    tok.parent = this;
    this.tokens.unshift(tok);
  }
}

describe('snapdragon-token', function() {
  describe('main export', function() {
    it('should export a function', function() {
      assert.strictEqual(typeof Token, 'function');
    });
  });

  describe('token', function() {
    it('should create a new Token with the given type', function() {
      const token = new Token('star');
      assert.strictEqual(token.type, 'star');
    });

    it('should create a new Token with the given type and val', function() {
      const token = new Token('star', '*');
      assert.strictEqual(token.type, 'star');
      assert.strictEqual(token.val, '*');
    });

    it('should create a new Token with the given object', function() {
      const token = new Token({type: 'star', val: '*'});
      assert.strictEqual(token.val, '*');
      assert.strictEqual(token.type, 'star');
    });

    it('should extend type and val onto a token', function() {
      const token = new Token({type: 'foo', val: 'bar'});
      assert.strictEqual(token.type, 'foo');
      assert.strictEqual(token.val, 'bar');
    });

    it('should add match array when first arg is an object', function() {
      const match = /^\w+/.exec('word');
      const token = new Token({type: 'foo', val: 'bar'}, match);
      assert.strictEqual(token.type, 'foo');
      assert.strictEqual(token.val, 'bar');
      assert.deepEqual(token.match.slice(), ['word']);
    });

    it('should add match array when type and val are strings', function() {
      const match = /^\w+/.exec('word');
      const token = new Token('foo', 'bar', match);
      assert.strictEqual(token.type, 'foo');
      assert.strictEqual(token.val, 'bar');
      assert.deepEqual(token.match.slice(), ['word']);
    });

    it('should add match array when type is a string', function() {
      const match = /^\w+/.exec('word');
      const token = new Token('foo', match);
      assert.strictEqual(token.type, 'foo');
      assert.strictEqual(token.val, 'word');
      assert.deepEqual(token.match.slice(), ['word']);
    });

    it('should extend arbitrary properties onto a token', function() {
      const token = new Token({type: 'foo', val: 'bar', baz: 'qux'});
      assert.strictEqual(token.baz, 'qux');
    });
  });

  describe('.isToken', function() {
    it('should be false if the value is not a Token', function() {
      assert(!Token.isToken({}));
      assert(!Token.isToken(null));
      assert(!Token.isToken([]));
    });

    it('should be true if the value is an instance of Token', function() {
      assert(Token.isToken(new Token()));
    });

    it('should be true if the object has isToken = true', function() {
      assert(Token.isToken({isToken: true}));
    });
  });
});
