var Promise = require('promise');
var drainer = require('drainer');

var Chain = function () {
  var resolve;
  var reject;
  
  var chainInstance = new Promise(function (_resolve, _reject) {
    resolve = _resolve;
    reject = _reject;
  });
  
  chainInstance._queue = [];
  
  chainInstance.drain = function (starter) {
    chainInstance._queue.unshift(starter);
    drainer(chainInstance._queue, function (err, items) {
      if (err) return reject(err);
      resolve(items);
    });
  }.bind(sequence);
  
  var sequence = function (initialFn) {
    if (typeof initialFn === 'object' && initialFn.length >= 0) {
      var list = initialFn;
      
      initialFn = function (next) {
        next(null, list);
      };
    }
    
    process.nextTick(function () {
      chainInstance.drain(initialFn);
    });
    
    return chainInstance;
  };

  sequence.add = function (name, task) {
    chainInstance[name] = function (iterator, callback) {
      chainInstance._queue.push(function (items, next) {
        task.call(sequence, items, iterator, function (err, items) {
          if (callback) callback(err, items);
          next(err, items);
        });
      });
      
      return chainInstance;
    }
  };

  return sequence;
};

var Series = function () {
  return new Chain();
};

Series.Chain = Chain;
module.exports = Series;