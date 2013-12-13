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
  };
  
  var sequence = function (value) {
    process.nextTick(function () {
      chainInstance.drain(sequence._parseValue(value));
    });
    
    return chainInstance;
  };
  
  sequence._parseValue = function (value) {
    if (typeof value === 'function') return value;
    
    // Promise
    if (value.then) {
      return function (next) {
        value.then(function (list) {
          next(null, list);
        });
      };
    }
    
    // String, Number, or any primitive
    return  function (next) {
      next(null, value);
    };
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