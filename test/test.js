'use strict';

var assert = require('assert');
var jscodeshift = require('jscodeshift');
var tranform = require('../transform');
var noop = function () {};

function testTransform (opts) {
  it(opts.before + ' => ' + opts.after, function () {
    var output = tranform(
      {
        path: 'test.js',
        source: opts.before
      },
      {
        jscodeshift: jscodeshift,
        stats: noop
      },
      Object.assign({}, opts.options)
    );
    assert.equal(output, opts.after);
  });
}

describe('.ok()', function () {
  testTransform({
    before: 'expect(foo).to.be.ok()',
    after: 'assert(foo)'
  });
  testTransform({
    before: 'expect(foo).to.not.be.ok()',
    after: 'assert(!foo)'
  });
  testTransform({
    before: 'expect(1).to.be.ok()',
    after: 'assert(1)'
  });
  testTransform({
    before: 'expect(true).to.be.ok()',
    after: 'assert(true)'
  });
  testTransform({
    before: 'expect({}).to.be.ok()',
    after: 'assert({})'
  });
  testTransform({
    before: 'expect(0).to.be.ok()',
    after: 'assert(0)'
  });
});

describe('.be() / .equal()', function () {
  testTransform({
    before: 'expect(foo).to.equal(bar)',
    after: 'assert(foo === bar)'
  });
  testTransform({
    before: 'expect(1).to.be(1)',
    after: 'assert(1 === 1)'
  });
  testTransform({
    before: 'expect(NaN).not.to.equal(NaN)',
    after: 'assert(NaN !== NaN)'
  });
  testTransform({
    before: 'expect(1).not.to.be(true)',
    after: 'assert(1 !== true)'
  });
  testTransform({
    before: 'expect("1").to.not.be(1)',
    after: 'assert("1" !== 1)'
  });
});

describe('.eql()', function () {
  testTransform({
    before: 'expect({ a: "b" }).to.eql({ a: "b" })',
    after: 'assert.deepEqual({ a: "b" }, { a: "b" })'
  });
  testTransform({
    before: 'expect({ foo: "bar" }).to.not.eql({ foo: "baz" })',
    after: 'assert.notDeepEqual({ foo: "bar" }, { foo: "baz" })'
  });
  testTransform({
    before: 'expect(1).to.eql("1")',
    after: 'assert.deepEqual(1, "1")'
  });
  testTransform({
    before: 'expect({ a: "1" }).to.eql({ a: 1 })',
    after: 'assert.deepEqual({ a: "1" }, { a: 1 })'
  });
});

describe('.match(regexp)', function () {
  testTransform({
    before: 'expect(str).to.match(re)',
    after: 'assert(re.test(str) === true)'
  });
  testTransform({
    before: 'expect(program.version).to.match(/[0-9]+.[0-9]+.[0-9]+/)',
    after: 'assert(/[0-9]+.[0-9]+.[0-9]+/.test(program.version) === true)'
  });
  testTransform({
    before: 'expect(str).to.not.match(re)',
    after: 'assert(re.test(str) === false)'
  });
});

describe('.contain(value)', function () {
  testTransform({
    before: 'expect(ary).to.contain(item)',
    after: 'assert(ary.indexOf(item) !== -1)'
  });
  testTransform({
    before: 'expect(str).to.not.contain(substr)',
    after: 'assert(str.indexOf(substr) === -1)'
  });
  testTransform({
    before: 'expect([1, 2]).to.contain(1)',
    after: 'assert([1, 2].indexOf(1) !== -1)'
  });
  testTransform({
    before: 'expect("hello world").to.contain("world")',
    after: 'assert("hello world".indexOf("world") !== -1)'
  });
});

describe('.length(value)', function () {
  testTransform({
    before: 'expect([]).to.have.length(0)',
    after: 'assert([].length === 0)'
  });
  testTransform({
    before: 'expect([1,2,3]).to.have.length(3)',
    after: 'assert([1,2,3].length === 3)'
  });
  testTransform({
    before: 'expect(str).to.not.have.length(zero)',
    after: 'assert(str.length !== zero)'
  });
});

describe('.above(value)', function () {
  testTransform({
    before: 'expect(ten).to.be.above(5)',
    after: 'assert(ten > 5)'
  });
  testTransform({
    before: 'expect(one).to.not.be.greaterThan(seven)',
    after: 'assert(one <= seven)'
  });
});

describe('.below(value)', function () {
  testTransform({
    before: 'expect(five).to.be.below(10)',
    after: 'assert(five < 10)'
  });
  testTransform({
    before: 'expect(four).to.not.be.lessThan(one)',
    after: 'assert(four >= one)'
  });
});

describe('.within(start,finish)', function () {
  testTransform({
    before: 'expect(seven).to.be.within(five,ten)',
    after: 'assert(five <= seven && seven <= ten)'
  });
  testTransform({
    before: 'expect(two).to.not.be.within(five,ten)',
    after: 'assert(two < five || ten < two)'
  });
});

describe('.throw([errorLike])', function () {
  testTransform({
    before: 'expect(func).to.throw()',
    after: 'assert.throws(func)'
  });
  testTransform({
    before: 'expect(func).to.not.throw()',
    after: 'assert.doesNotThrow(func)'
  });
  testTransform({
    before: 'expect(func).to.throw(/error message/)',
    after: 'assert.throws(func, /error message/)'
  });
  testTransform({
    before: 'expect(func).to.not.throw(/error message/)',
    after: 'assert.doesNotThrow(func, /error message/)'
  });
  testTransform({
    before: 'expect(func).to.throw(function(e) {})',
    after: 'assert.throws(func, function(e) {})'
  });
  testTransform({
    before: 'expect(func).to.not.throw()',
    after: 'assert.doesNotThrow(func)'
  });

  testTransform({
    before: 'expect(func).to.throwError()',
    after: 'assert.throws(func)'
  });
  testTransform({
    before: 'expect(func).to.not.throwError()',
    after: 'assert.doesNotThrow(func)'
  });
  testTransform({
    before: 'expect(func).to.throwException()',
    after: 'assert.throws(func)'
  });
  testTransform({
    before: 'expect(func).to.not.throwException()',
    after: 'assert.doesNotThrow(func)'
  });
});
