'use strict';

const chai = require('chai');
const cssplus = require('../lib');
const util = require('./util');

const expect = chai.expect;

describe('node API', () => {
  it('should return a css string', done => {
    cssplus('body {}', {
      lint: false
    }).then(result => {
      expect(result.css).to.be.a('string');
      done();
    });
  });

  it('should handle invalid input', () => {
    expect(() => {
      cssplus(null, {lint: false});
    }).to.throw(TypeError);
  });

  it('should preprocess CSS correctly', done => {
    const input = util.read('fixtures/component');
    const output = util.read('fixtures/component.out');

    cssplus(input, {
      root: 'test/fixtures',
      lint: false,
      // disable autoprefixer
      autoprefixer: {add: false, remove: false}
    }).then(result => {
      expect(result.css.trim()).to.be.equal(output.trim());
      done();
    }).catch(done);
  });

  it('should add vendor prefixes', done => {
    const input = '.test { filter: blur(1px) }';
    const output = '.test { filter: url(\'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="filter"><feGaussianBlur stdDeviation="1" /></filter></svg>#filter\'); -webkit-filter: blur(1px); filter: blur(1px) }';

    cssplus(input, {
      lint: false,
      autoprefixer: {
        browsers: 'Chrome 50'
      }
    }).then(result => {
      expect(result.css.trim()).to.be.equal(output.trim());
      done();
    }).catch(done);
  });
});
