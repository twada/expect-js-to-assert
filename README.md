expect-js-to-assert
================================

A [jscodeshift](https://github.com/facebook/jscodeshift) codemod that transforms from [Automattic/expect.js](https://github.com/Automattic/expect.js) to [Node assert](https://nodejs.org/api/assert.html).

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]
[![Code Style][style-image]][style-url]
[![License][license-image]][license-url]


USAGE
---------------------------------------

```sh
$ npm install -g jscodeshift
$ npm install expect-js-to-assert
$ jscodeshift -t node_modules/expect-js-to-assert/transform.js target-dir
```


FEATURES
---------------------------------------

#### matchers

- [x] `.ok()`
- [x] `.be(value)` (alias `.equal`)
- [x] `.eql(value)`
- [ ] `.a(type)` (alias `.an`)
- [x] `.match(regexp)`
- [x] `.contain(needle)`
- [x] `.length(size)`
- [ ] `.empty()`
- [ ] `.property(name, [value])`
- [ ] `.key(name)`
- [ ] `.keys(...name)`
- [x] `.throw([errorMatcher])` (alias `.throwException`, `.throwError`)
- [x] `.within(start, finish)`
- [x] `.above(value)` (alias `.greaterThan`)
- [x] `.below(value)` (alias `.lessThan`)
- [ ] `.fail([reason])`

#### chains

- [x] `.not`
- [ ] `.withArgs(...args)`


AUTHOR
---------------------------------------
* [Takuto Wada](https://github.com/twada)


CONTRIBUTORS
---------------------------------------
* [Haoliang Gao (popomore)](https://github.com/popomore)


LICENSE
---------------------------------------
Licensed under the [MIT](https://github.com/twada/expect-js-to-assert/blob/master/LICENSE) license.

[npm-url]: https://npmjs.org/package/expect-js-to-assert
[npm-image]: https://badge.fury.io/js/expect-js-to-assert.svg

[travis-url]: https://travis-ci.org/twada/expect-js-to-assert
[travis-image]: https://secure.travis-ci.org/twada/expect-js-to-assert.svg?branch=master

[license-url]: https://github.com/twada/expect-js-to-assert/blob/master/LICENSE
[license-image]: https://img.shields.io/badge/license-MIT-brightgreen.svg

[style-url]: https://github.com/Flet/semistandard
[style-image]: https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg
