'use strict';

require('mocha');
var assert = require('assert');
var Token = require('..');

// mock lexer
function Lexer() {
  this.tokens = [];
}
Lexer.prototype.push = function(tok) {
  tok.parent = this;
  this.tokens.push(tok);
};
Lexer.prototype.unshift = function(tok) {
  tok.parent = this;
  this.tokens.unshift(tok);
};

describe('snapdragon-token', function() {
  describe('main export', function() {
    it('should export a function', function() {
      assert.strictEqual(typeof Token, 'function');
    });
  });

  describe('token', function() {
    it('should create a new Token with the given type', function() {
      var token = new Token('star');
      assert.strictEqual(token.type, 'star');
    });

    it('should create a new Token with the given type and val', function() {
      var token = new Token('star', '*');
      assert.strictEqual(token.type, 'star');
      assert.strictEqual(token.val, '*');
    });

    it('should create a new Token with the given object', function() {
      var token = new Token({val: '*', type: 'star'});
      assert.strictEqual(token.val, '*');
      assert.strictEqual(token.type, 'star');
    });

    it('should extend type and val onto a token', function() {
      var token = new Token({type: 'foo', val: 'bar'});
      assert.strictEqual(token.type, 'foo');
      assert.strictEqual(token.val, 'bar');
    });

    it('should extend arbitrary properties onto a token', function() {
      var token = new Token({type: 'foo', val: 'bar', baz: 'qux'});
      assert.strictEqual(token.baz, 'qux');
    });

    it('should not extend existing getter properties onto a token', function() {
      var token = new Token({type: 'foo', val: 'bar', index: 11});
      assert.strictEqual(token.index, -1);
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

  describe('.length', function() {
    it('should get the length of token.val', function() {
      assert.strictEqual(new Token({type: 'slash', val: '//'}).length, 2);
      assert.strictEqual(new Token({type: 'slash', val: 'a'}).length, 1);
    });

    it('should be zero when token.val is undefined', function() {
      var token = new Token({type: 'eos', val: undefined});
      assert.strictEqual(token.length, 0);
    });
  });

  describe('.index', function() {
    it('should return -1 when siblings array does not exist', function() {
      var foo = new Token('foo');
      assert.strictEqual(foo.index, -1);
    });

    it('should get the index of a token from token.siblings', function() {
      var lexer = new Lexer();
      var foo = new Token({type: 'foo'}, lexer);
      var bar = new Token({type: 'bar'}, lexer);
      var baz = new Token({type: 'baz'}, lexer);
      var qux = new Token({type: 'qux'}, lexer);

      lexer.push(foo);
      lexer.push(bar);
      lexer.push(baz);
      lexer.unshift(qux);

      assert.strictEqual(foo.index, 1);
      assert.strictEqual(bar.index, 2);
      assert.strictEqual(baz.index, 3);
      assert.strictEqual(qux.index, 0);
    });

    it('should allow an index to be set', function() {
      var lexer = new Lexer();
      var star = new Token('star', '*', lexer);
      var dot = new Token('dot', '.', lexer);
      star.index = 0;
      dot.index = 1;
      lexer.push(star);
      lexer.push(dot);
      assert.strictEqual(star.index, 0);
      assert.strictEqual(dot.index, 1);
    });

    it('should return the correct index when set incorrectly', function() {
      var lexer = new Lexer();
      var star = new Token('star', '*', lexer);
      var dot = new Token('star', '.', lexer);
      star.index = 0;
      dot.index = 1;
      lexer.push(star);
      lexer.push(dot);
      star.index = 42;
      dot.index = 9;
      assert.strictEqual(star.index, 0);
      assert.strictEqual(dot.index, 1);
    });
  });

  describe('.parent', function() {
    it('should set token.parent when passed to ctor', function() {
      var lexer = new Lexer();
      var token = new Token({type: 'foo'}, lexer);
      assert(lexer === token.parent);
    });

    it('should allow token.parent to be set after instantiation', function() {
      var lexer = new Lexer();
      var token = new Token({type: 'foo'});
      assert(token.parent === undefined);
      token.parent = lexer;
      assert(token.parent === lexer);
    });
  });

  describe('.siblings', function() {
    it('should throw an error if set', function() {
      assert.throws(function() {
        var token = new Token('foo');
        token.siblings = [];
      });
    });

    it('should set lexer.tokens as token.siblings', function() {
      var lexer = new Lexer();
      var token = new Token({type: 'foo'}, lexer);
      assert(lexer.tokens === token.siblings);
    });

    it('should get `token.parent.siblings`', function() {
      var lexer = new Lexer();
      var foo = new Token({type: 'foo'});
      var bar = new Token({type: 'bar'});
      var baz = new Token({type: 'baz'});
      var qux = new Token({type: 'qux'});

      lexer.push(bar);
      lexer.push(baz);
      lexer.unshift(qux);

      assert.strictEqual(foo.siblings, undefined);
      assert.strictEqual(bar.siblings.length, 3);
      assert.strictEqual(baz.siblings.length, 3);
      assert.strictEqual(qux.siblings.length, 3);
    });
  });

  describe('.index', function() {
    it('should get the token.index from siblings', function() {
      var lexer = new Lexer();
      var foo = new Token({type: 'foo'});
      var bar = new Token({type: 'bar'});

      lexer.push(foo);
      lexer.push(new Token({type: '?'}));
      lexer.push(new Token({type: '?'}));
      lexer.push(bar);
      lexer.push(new Token({type: '?'}));

      assert.strictEqual(foo.siblings.length, 5);
      assert.strictEqual(foo.index, 0);

      assert.strictEqual(bar.siblings.length, 5);
      assert.strictEqual(bar.index, 3);
    });
  });

  describe('.parent.push', function() {
    it('should push tokens onto token.siblings', function() {
      var lexer = new Lexer();
      var token = new Token({type: 'foo'}, lexer);
      assert.deepEqual(token.siblings, []);

      lexer.push(new Token({type: 'a'}));
      assert.strictEqual(token.siblings.length, 1);
      assert.strictEqual(lexer.tokens.length, 1);

      lexer.push(new Token({type: 'b'}));
      assert.strictEqual(token.siblings.length, 2);
      assert.strictEqual(lexer.tokens.length, 2);

      lexer.push(new Token({type: 'c'}));
      assert.strictEqual(token.siblings.length, 3);
      assert.strictEqual(lexer.tokens.length, 3);

      lexer.push(new Token({type: 'd'}));
      assert.strictEqual(token.siblings.length, 4);
      assert.strictEqual(lexer.tokens.length, 4);
    });
  });

  describe('.unshift', function() {
    it('should unshift tokens onto token.siblings', function() {
      var lexer = new Lexer();
      var token = new Token({type: 'foo'}, lexer);
      assert.deepEqual(token.siblings, []);

      lexer.unshift(new Token({type: 'a'}));
      assert.strictEqual(token.siblings.length, 1);
      assert.strictEqual(lexer.tokens.length, 1);

      lexer.unshift(new Token({type: 'b'}));
      assert.strictEqual(token.siblings.length, 2);
      assert.strictEqual(lexer.tokens.length, 2);

      lexer.unshift(new Token({type: 'c'}));
      assert.strictEqual(token.siblings.length, 3);
      assert.strictEqual(lexer.tokens.length, 3);

      lexer.unshift(new Token({type: 'd'}));
      assert.strictEqual(token.siblings.length, 4);
      assert.strictEqual(lexer.tokens.length, 4);
    });
  });

  describe('.prev', function() {
    it('should throw an error when setter is set', function() {
      assert.throws(function() {
        var token = new Token('foo');
        token.prev = new Token('bar');
      });
    });

    it('should get the prev token from token.siblings', function() {
      var lexer = new Lexer();
      var foo = new Token({type: 'foo'}, lexer);
      var bar = new Token({type: 'bar'}, lexer);
      var baz = new Token({type: 'baz'}, lexer);

      lexer.push(foo);
      lexer.push(bar);
      lexer.push(baz);

      assert.strictEqual(foo.prev, undefined);
      assert.strictEqual(bar.prev, foo);
      assert.strictEqual(baz.prev, bar);
    });

    it('should get the prev token from `token.siblings`', function() {
      var lexer = new Lexer();
      var foo = new Token({type: 'foo'}, lexer);
      var bar = new Token({type: 'bar'}, lexer);
      var baz = new Token({type: 'baz'}, lexer);

      lexer.push(foo);
      lexer.push(bar);
      lexer.push(baz);

      assert.strictEqual(foo.prev, undefined);
      assert.strictEqual(bar.prev.type, 'foo');
      assert.strictEqual(baz.prev.type, 'bar');
    });
  });

  describe('.next', function() {
    it('should throw an error when setter is set', function() {
      assert.throws(function() {
        var token = new Token('foo');
        token.next = new Token('bar');
      });
    });

    it('should get the next token from `token.siblings`', function() {
      var lexer = new Lexer();
      var foo = new Token({type: 'foo'}, lexer);
      var bar = new Token({type: 'bar'}, lexer);
      var baz = new Token({type: 'baz'}, lexer);

      lexer.push(foo);
      lexer.push(bar);
      lexer.push(baz);

      assert.equal(lexer.tokens.length, 3);

      assert.equal(foo.parent, lexer);
      assert.equal(bar.parent, lexer);
      assert.equal(baz.parent, lexer);

      assert.strictEqual(foo.next, bar);
      assert.strictEqual(bar.next, baz);
      assert.strictEqual(baz.next, undefined);
    });
  });
});
