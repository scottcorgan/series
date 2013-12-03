var Promise = require('promise');

var Chain = function () {
  var resolve;
  var reject;
  
  var chainInstance = new Promise(function (_resolve, _reject) {
    resolve = _resolve;
    reject = _reject;
  });
  
  chainInstance._queue = [];
  
  chainInstance.drain = function () {
    _runTask(chainInstance._queue);
    
    function _runTask (queue) {
      var sequenceMethod = queue.shift();
      
      if (!sequenceMethod) return resolve(sequence._items);
      
      sequenceMethod.task.call(sequence, sequence._items, sequenceMethod.iterator, function  (err, items) {
        sequence._items = items;
        _runTask(queue);
      });
    }
  }.bind(sequence);
  
  var sequence = function (list) {
    
    // Callback
    if (typeof list === 'function') {
      list(function (err, items) {
        // if (err) return sequence.triggerError(err, [], 'start');
        
        sequence._items = items;
        process.nextTick(chainInstance.drain);
      });
    }
    
    // Array
    if (typeof list === 'object' && list.length >= 0) {
      sequence._items = list;
      process.nextTick(chainInstance.drain);
    }
    
    return chainInstance;
  };

  sequence.add = function (name, task) {
    chainInstance[name] = function (iterator) {
      chainInstance._queue.push({
        iterator: iterator,
        task: task
      });
      
      return chainInstance;
    }
  };
  
  sequence.triggerError = function (err, item, fnName) {
    // TODO: implement
  };

  return sequence;
};

var Series = function () {
  return new Chain();
};

Series.Chain = Chain;
module.exports = Series;