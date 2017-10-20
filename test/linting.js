'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const cssplus = require('../lib');
const util = require('./util');

const expect = chai.expect;

chai.use(chaiAsPromised);

describe('postcss-bem-linter', () => {
  it('should pass if component conforms', () => expect(
    cssplus('/** @define Foo */\n\n.Foo { color: red; }\n', {
      'postcss-reporter': {
        throwError: true
      }
    })
  ).to.be.fulfilled);

  it('should fail if component does not conform', () => expect(
    cssplus('/** @define Foo */\n\n.foo { color: red; }\n', {
      'postcss-reporter': {
        throwError: true
      }
    })
  ).to.be.rejectedWith(Error, 'postcss-reporter: warnings or errors were found'));
});

describe('stylelint', () => {
  it('should lint the component', () => expect(
    cssplus(util.read('fixtures/component'), {
      root: 'test/fixtures',
      'postcss-reporter': {
        throwError: false
      }
    })
  ).to.be.fulfilled);

  it('should allow the config to be overidden', () => expect(
    cssplus('@import "./stylelint.css"\n\n', {
      root: 'test/fixtures',
      stylelint: {
        extends: 'stylelint-config-cssplus',
        rules: {
          indentation: 4
        }
      },
      'postcss-reporter': {
        throwError: true
      }
    })
  ).to.be.fulfilled);

  it('should throw an error if stylelint fails', () => expect(
    cssplus('@import "./stylelint.css"\n\n', {
      root: 'test/fixtures',
      'postcss-reporter': {
        throwError: true
      }
    })
  ).to.be.rejectedWith(Error, 'postcss-reporter: warnings or errors were found'));

  it('should lint the input file', () => expect(
    cssplus('@import "./stylelint.css"\n\n', {
      root: 'test/fixtures',
      'postcss-reporter': {
        throwError: true
      }
    })
  ).to.be.rejectedWith(Error, 'postcss-reporter: warnings or errors were found'));
});

describe('disabling linting', () => {
  it('should not run stylelint or postcss-bem-linter', () => expect(
    cssplus('/** @define Foo */\n\n.foo {color: red;}', {
      lint: false,
      'postcss-reporter': {
        throwError: true
      }
    })
  ).to.be.fulfilled);
});

