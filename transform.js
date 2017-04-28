'use strict';

var assert = require('assert');
var MATCHER_METHODS = [
  'ok',
  'equal', 'be',
  'eql',
  'match',
  'contain',
  'length',
  'above', 'greaterThan',
  'below', 'lessThan',
  'within',
  'throw', 'throwError', 'throwException'
];
var FLAGS = [
  'not'
];

function isBddStyleNode (node) {
  if (node.type === 'CallExpression') {
    if (node.callee.type === 'Identifier' && node.callee.name === 'expect') {
      return true;
    } else {
      return isBddStyleNode(node.callee);
    }
  } else if (node.type === 'MemberExpression') {
    return isBddStyleNode(node.object);
  }
  return false;
}

function collectFlagsAndSubjects (node, collector) {
  if (node.type === 'CallExpression') {
    if (node.callee.type === 'Identifier' && node.callee.name === 'expect') {
      collector['subjects'] = node.arguments;
      return collector;
    } else {
      return collectFlagsAndSubjects(node.callee, collector);
    }
  } else if (node.type === 'MemberExpression') {
    if (node.property.type === 'Identifier' && FLAGS.indexOf(node.property.name) !== -1) {
      collector[node.property.name] = true;
    }
    return collectFlagsAndSubjects(node.object, collector);
  } else {
    return assert(false, 'cannot be here');
  }
}

module.exports = function transform (file, api, options) {
  var j = api.jscodeshift;
  var ast = j(file.source);
  var assertion = function (node) {
    return j.callExpression(j.identifier('assert'), [node]);
  };

  ast.find(j.CallExpression, {
    callee: {
      type: 'MemberExpression',
      property: function (node) {
        return node.type === 'Identifier' &&
          MATCHER_METHODS.indexOf(node.name) !== -1;
      },
      object: isBddStyleNode
    }
  }).replaceWith(function (path) {
    var flagsAndSubjects = collectFlagsAndSubjects(path.value, {});
    var hasFlag = function (flag) {
      return !!flagsAndSubjects[flag];
    };
    var negation = hasFlag('not');
    var subject = flagsAndSubjects['subjects'][0];
    if (!subject) {
      return path.node;
    }
    var matcherArg = path.value.arguments[0];
    var prependBangIfNegation = function (expr) {
      return negation ? j.unaryExpression('!', expr) : expr;
    };
    var strictEquality = function (left, right) {
      return assertion(j.binaryExpression(
        negation ? '!==' : '===',
        left,
        right
      ));
    };
    var inequality = function (operator) {
      return assertion(j.binaryExpression(
        operator, subject, matcherArg
      ));
    };
    var looseDeepEquality = function (actual, expected) {
      return j.callExpression(
        j.memberExpression(
          j.identifier('assert'),
          negation ? j.identifier('notDeepEqual') : j.identifier('deepEqual')
        ),
        [
          actual,
          expected
        ]);
    };
    var inclusion = function (spec) {
      return assertion(j.binaryExpression(
        negation ? '===' : '!==',
        j.callExpression(j.memberExpression(spec.haystack, j.identifier('indexOf')), [spec.needle]),
        j.unaryExpression('-', j.literal(1))
      ));
    };
    switch (path.value.callee.property.name) {
      case 'ok':
        return assertion(prependBangIfNegation(subject));
      case 'be':
      case 'equal':
        return strictEquality(subject, matcherArg);
      case 'eql':
        return looseDeepEquality(subject, matcherArg);
      case 'match':
        return assertion(
          j.binaryExpression(
            '===',
            j.callExpression(j.memberExpression(matcherArg, j.identifier('test')), [subject]),
            negation ? j.booleanLiteral(false) : j.booleanLiteral(true)
          )
        );
      case 'contain':
        return inclusion({
          haystack: subject,
          needle: matcherArg
        });
      case 'length':
        return strictEquality(
          j.memberExpression(subject, j.identifier('length')),
          matcherArg
        );
      case 'greaterThan':
      case 'above':
        return inequality(negation ? '<=' : '>');
      case 'lessThan':
      case 'below':
        return inequality(negation ? '>=' : '<');
      case 'within':
        if (negation) {
          return assertion(j.logicalExpression(
            '||',
            j.binaryExpression('<', subject, path.value.arguments[0]),
            j.binaryExpression('<', path.value.arguments[1], subject)
          ));
        } else {
          return assertion(j.logicalExpression(
            '&&',
            j.binaryExpression('<=', path.value.arguments[0], subject),
            j.binaryExpression('<=', subject, path.value.arguments[1])
          ));
        }
      case 'throw':
      case 'throwError':
      case 'throwException':
        return j.callExpression(
          j.memberExpression(
            j.identifier('assert'),
            negation ? j.identifier('doesNotThrow') : j.identifier('throws')
          ), [subject].concat(path.value.arguments));
      default:
        return assert(false, 'cannot be here');
    }
  });

  return ast.toSource();
};
