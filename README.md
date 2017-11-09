# snapdragon-token [![NPM version](https://img.shields.io/npm/v/snapdragon-token.svg?style=flat)](https://www.npmjs.com/package/snapdragon-token) [![NPM monthly downloads](https://img.shields.io/npm/dm/snapdragon-token.svg?style=flat)](https://npmjs.org/package/snapdragon-token) [![NPM total downloads](https://img.shields.io/npm/dt/snapdragon-token.svg?style=flat)](https://npmjs.org/package/snapdragon-token) [![Linux Build Status](https://img.shields.io/travis/jonschlinkert/snapdragon-token.svg?style=flat&label=Travis)](https://travis-ci.org/jonschlinkert/snapdragon-token)

> Create a snapdragon token. Used by the snapdragon lexer, but can also be used by plugins.

Please consider following this project's author, [Jon Schlinkert](https://github.com/jonschlinkert), and consider starring the project to show your :heart: and support.

## Table of Contents

<details>
<summary><strong>Details</strong></summary>

- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Lexer](#lexer)
- [About](#about)

</details>

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save snapdragon-token
```

## Usage

```js
var snapdragonToken = require('snapdragon-token');
```

## API

### [Token](index.js#L21)

Create a new `Token` with the given `val` and `type`.

**Params**

* `val` **{String|Object}**: Value to set
* `type` **{String}**: The token type to use when `val` is a string.
* `parent` **{Object}**: Object with `tokens` array or Lexer instance
* `match` **{Arguments}**: Arguments from regex `.exec`
* `returns` **{Object}**: token instance

**Example**

```js
var token = new Token('*', 'Star');
var token = new Token({type: 'star', val: '*'});
```

### [.Token#isToken](index.js#L52)

Static method that returns true if the given value is an instance of snapdragon-token, or is an object with `isToken=true`.

**Params**

* `token` **{Object}**
* `returns` **{Boolean}**

**Example**

```js
var Token = require('snapdragon-token');
console.log(Token.isToken(new Token({type: 'foo'}))); //=> true
console.log(Token.isToken({isToken: true})); //=> true
console.log(Token.isToken({})); //=> false
```

### [.siblings](index.js#L73)

Returns the `lexer.tokens` array if a Lexer was either passed to the Token constructor when instantiating, or set on `token.parent` after instantiating.

* `returns` **{Array|undefined}**

**Example**

```js
var Lexer = require('snapdragon-lexer');
var lexer = new Lexer();
var foo = new Token('star', '*', lexer);
console.log(foo.siblings === lexer.tokens);
//=> true
```

### [.index](index.js#L111)

Returns the correct index of the token from the [siblings](#siblings) array, or `-1` if `token.siblings` is undefined or the token does not exist on `token.siblings`.

* `returns` **{Object}**

**Example**

```js
var Lexer = require('snapdragon-lexer');
var lexer = new Lexer();

var slash = new Token('slash', '/', lexer);
var star = new Token('star', '*', lexer);
var dot = new Token('dot', '.', lexer);
console.log(slash.index) //=> -1
console.log(star.index) //=> -1
console.log(dot.index) //=> -1

lexer.tokens.push(slash);
console.log(slash.index) //=> 0

lexer.tokens.push(star);
console.log(star.index) //=> 1

lexer.tokens.unshift(dot);
console.log(slash.index) //=> 1
console.log(star.index) //=> 2
console.log(dot.index) //=> 0
```

### [.length](index.js#L144)

Get the string length of `token.val`

* `returns` **{Number}**

**Example**

```js
var token = new Token({type: 'slash', val: '//'});
console.log(token.length);
//=> 2

var token = new Token({type: 'eos', val: undefined});
console.log(token.length); // end-of-string
//=> 0
```

### [.prev](index.js#L168)

Get the previous token from the `token.siblings` array.

* `returns` **{Object|undefined}**: Returns the previous token is one exists.

**Example**

```js
var Lexer = require('snapdragon-lexer');
var lexer = new Lexer();
var slash = new Token('slash', '/', lexer);
var star = new Token('star', '*', lexer);
lexer.tokens.push(slash);
lexer.tokens.push(star);
console.log(slash.prev) //=> undefined
console.log(star.prev) //=> Token { type: 'slash', val: '/' }
```

### [.next](index.js#L192)

Get the next token from the [siblings](#siblings) array.

* `returns` **{Object|undefined}**: Returns the next token if one exists.

**Example**

```js
var Lexer = require('snapdragon-lexer');
var lexer = new Lexer();
var slash = new Token('slash', '/', lexer);
var star = new Token('star', '*', lexer);
lexer.tokens.push(slash);
lexer.tokens.push(star);
console.log(slash.next) //=> Token { type: 'star', val: '*' }
console.log(star.next) //=> undefined
```

## Lexer

Throughout the docs, it's mentioned that you can pass a Lexer instance to the Token constructor when instantiating. This is useful to allow tokens to get their own `token.index`, as well as the `.next` and `.prev` sibling tokens.

The following code example shows the minimum Lexer implementation necessary for this to work.

```js
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
```

## About

<details>
<summary><strong>Contributing</strong></summary>

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

Please read the [contributing guide](.github/contributing.md) for advice on opening issues, pull requests, and coding standards.

</details>

<details>
<summary><strong>Running Tests</strong></summary>

Running and reviewing unit tests is a great way to get familiarized with a library and its API. You can install dependencies and run tests with the following command:

```sh
$ npm install && npm test
```

</details>

<details>
<summary><strong>Building docs</strong></summary>

_(This project's readme.md is generated by [verb](https://github.com/verbose/verb-generate-readme), please don't edit the readme directly. Any changes to the readme must be made in the [.verb.md](.verb.md) readme template.)_

To generate the readme, run the following command:

```sh
$ npm install -g verbose/verb#dev verb-generate-readme && verb
```

</details>

### Related projects

You might also be interested in these projects:

* [snapdragon-node](https://www.npmjs.com/package/snapdragon-node): Snapdragon utility for creating a new AST node in custom code, such as plugins. | [homepage](https://github.com/jonschlinkert/snapdragon-node "Snapdragon utility for creating a new AST node in custom code, such as plugins.")
* [snapdragon-util](https://www.npmjs.com/package/snapdragon-util): Utilities for the snapdragon parser/compiler. | [homepage](https://github.com/jonschlinkert/snapdragon-util "Utilities for the snapdragon parser/compiler.")
* [snapdragon](https://www.npmjs.com/package/snapdragon): Easy-to-use plugin system for creating powerful, fast and versatile parsers and compilers, with built-in source-map… [more](https://github.com/jonschlinkert/snapdragon) | [homepage](https://github.com/jonschlinkert/snapdragon "Easy-to-use plugin system for creating powerful, fast and versatile parsers and compilers, with built-in source-map support.")

### Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](https://twitter.com/jonschlinkert)

### License

Copyright © 2017, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT License](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.6.0, on November 09, 2017._