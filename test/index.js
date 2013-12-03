var Series = require('../');
var chain = Series();
var async = require('async');

chain.add('each', function (items, iterator, next) {
  async.each(items, iterator, next);
});

chain.add('map', function (items, iterator, next) {
  async.map(items, iterator, next);
});

chain.add('filter', function (items, iterator, next) {
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

// chain(function (next) {
//   next(null, list);
// })
chain(list)
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
//  var chain;
//
//  beforeEach(function () {
//     chain = Series();
//  });
//
//  it('Chain instance is a method', function () {
//    expect(chain).to.be.a('function');
//  });
//
//  describe('#add()', function() {
//    it('adds methods to the methods list with the given name', function () {
//      chain.add('method1');
//      expect(chain.getMethod('method1')).to.not.be(undefined);
//    });
//
//    it('adds a method to the methods list with the given definition', function () {
//      var method = function (next) {
//        next();
//      };
//      chain.add('method1', method);
//
//      expect(chain.getMethod('method1')).to.be.a('function');
//      expect(chain.getMethod('method1').toString()).to.equal(method.toString());
//    });
//
//    it('defaults to an empty method if no method definition is given', function () {
//      chain.add('method1');
//      expect(chain.getMethod('method1')).to.be.a('function');
//    });
//
//    it('adds the method definition to the object chain', function () {
//      var method = function (next) {next();};
//      chain.add('method1', method);
//
//      expect(chain().method1.toString()).to.equal(method.toString());
//    });
//  });
//});
//
//
