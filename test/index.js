var Series = require('../');
var series = Series();
var async = require('async');

series.add('each', function (items, iterator, next) {
  async.each(items, iterator, next);
});

series.add('map', function (items, iterator, next) {
  async.map(items, iterator, next);
});

series.add('filter', function (items, iterator, next) {
  var self = this;
  var error;
  
  async.filter(items, function (item, callback) {
    iterator(item, function (err, matched) {
      if (err) {
        error = err;
        return self.triggerError(err, item, 'filter');
      }
      
      callback(matched);
    });
  }, function (filteredItems) {
    next(error, filteredItems);
  });
});

var list = [
  {
    name: 'scott',
    age: 29
  },
  {
    name: 'lindsay',
    age: 25
  }
];

// series(function (next) {
//   next(null, list);
// })
series(list)
  .filter(function (item, next) {
    next(null, item.age == 29);
  })
  .map(function (item, next) {
    next(null, item.name);
  })
  .then(function (items) {
    console.log('THEN:', items);
  });














//var Series = require('../');
//var expect = require('expect.js');
//
//describe('Series', function () {
//  var series;
//
//  beforeEach(function () {
//     series = Series();
//  });
//
//  it('Chain instance is a method', function () {
//    expect(series).to.be.a('function');
//  });
//
//  describe('#add()', function() {
//    it('adds methods to the methods list with the given name', function () {
//      series.add('method1');
//      expect(series.getMethod('method1')).to.not.be(undefined);
//    });
//
//    it('adds a method to the methods list with the given definition', function () {
//      var method = function (next) {
//        next();
//      };
//      series.add('method1', method);
//
//      expect(series.getMethod('method1')).to.be.a('function');
//      expect(series.getMethod('method1').toString()).to.equal(method.toString());
//    });
//
//    it('defaults to an empty method if no method definition is given', function () {
//      series.add('method1');
//      expect(series.getMethod('method1')).to.be.a('function');
//    });
//
//    it('adds the method definition to the object series', function () {
//      var method = function (next) {next();};
//      series.add('method1', method);
//
//      expect(series().method1.toString()).to.equal(method.toString());
//    });
//  });
//});
//
//
