var queue = [
  function (next) {
//     console.log('task1');
    next();
  },
  function (next) {
//     console.log('task2');
    next();
  }
];


run(queue, function () {
//   console.log('done');
});


function run(queue, callback, args) {
  var fn = queue.shift();
  
    if (!fn) return callback();
  
  args = args || [];
  args.push(function () {
    run(queue, callback, arguments)
  });
  
  fn.call(fn, args);
}