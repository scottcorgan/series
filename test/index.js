var Series = require('../');
var series = Series();
var async = require('async');
var Promise = require('promise');
var expect = require('expect.js');
var sinon = require('sinon');

describe('Series', function () {
  var series;
  
  beforeEach(function () {
    series = Series();
  });
  
  describe('#add()', function() {
    it('adds a method to the sequence', function () {
      series.add('method1', function () {});
      expect(series([])).to.have.key('method1');
    });
    
    it('provides the value to each method added to the sequence', function (done) {
      var initialValue = ['my value'];
      
      series.add('method1', function (value, iterator, next) {
        expect(value).to.eql(initialValue);
        done();
      });
      
      series(initialValue).method1();
    });
    
    it('provides an iterator to each method add to the sequence', function (done) {
      var originalIterator = function () {};
      
      series.add('method1', function (value, iterator) {
        expect(originalIterator.toString()).to.equal(iterator.toString());
        done();
      });
      
      series([]).method1(originalIterator);
    });
    
    it('requires series method to call the callback in order to proceed', function (done) {
      var value = ['value'];
      
      series.add('method1', function (value, iterator, next) {
        iterator(value, next);
      });
      
      series(value).method1(function (value, next) {
        next(null, value);
      }).then(function (processedValue) {
        expect(value).to.eql(processedValue);
        done();
      });
    });
  });
});

describe('#series()', function() {
  var series;
  
  beforeEach(function () {
    series = Series();
  });
  
  it('fails quick on error', function (done) {
    var spy = sinon.spy();
    
    series.add('method1', function (_value, iterator, next) {
      next('ERROR');
    });
    
    series.add('method2', function (_value, iterator, next) {
      spy(); // This shouldn't get called
      next(null, _value);
    });
    
    series(['value1', 'value2'])
      .method1()
      .then(function () {}, function (err) {
        expect(err).to.equal('ERROR');
        expect(spy.called).to.equal(false);
        done();
      });
  });
  
  it('accepts and then calls a callback on each method in the sequence', function (done) {
    series.add('method1', function (_value, iterator, next) {
      next(null, _value);
    });
    
    series([1,2]).method1(function () {}, function (err, _value) {
      expect(_value).to.eql([1,2]);
      expect(err).to.equal(null);
      done();
    });
  });
  
  it('returns a promise at the end of the method sequence', function () {
    series.add('method1', function (_value, iterator, next) {});
    expect(series([1])).to.have.key('then');
  });
  
  describe('initial value type', function() {
    var value = ['value1', 'value2'];
    var valueStr = 'string value';
    var valueNum = 3;
    
    // FIX ME: doesn't support strings yet
    it('supports strings', function (done) {
      series(valueStr).then(function (processedValue) {
        expect(valueStr).to.equal(processedValue);
        done();
      });
    });
    
    // FIX ME: doesn't support strings yet
    it('supports numbers', function (done) {
      series(valueNum).then(function (processedValue) {
        expect(valueNum).to.equal(processedValue);
        done();
      });
    });
    
    it('supports arrays', function (done) {
      series(value).then(function (processedValue) {
        expect(value).to.eql(processedValue);
        done();
      })
    });
    
    it('supports a callback', function (done) {
      series(function (next) {
        next(null, value);
      }).then(function (processedValue) {
        expect(value).to.eql(processedValue);
        done();
      });
    });
    
    it('supports promises', function (done) {
      var promise = new Promise(function (resolve) {
        resolve(value);
      });
      
      series(promise).then(function (processedValue) {
        expect(value).to.eql(processedValue);
        done();
      });
    });
  });
});