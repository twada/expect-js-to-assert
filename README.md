expect-js-to-assert
================================

A [jscodeshift](https://github.com/facebook/jscodeshift) codemod that transforms from [Automattic/expect.js](https://github.com/Automattic/expect.js) to [Node assert](https://nodejs.org/api/assert.html).


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
- [ ] `.throw([errMatcher])` (alias `.throwException`, `.throwError`)
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


LICENSE
---------------------------------------
Licensed under the [MIT](https://github.com/twada/expect-js-to-assert/blob/master/LICENSE) license.
