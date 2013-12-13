var Series = require('../');
var series = Series();

series.add('pluralize', function (value, letter, next) {
  next(null, value + letter);
});

series.add('angrify', function (value, punctuation, next) {
  next(null, value + punctuation);
});

series('Cat')
  .pluralize('z')
  .angrify('?!')
  .then(function (animal) {
    // Outputs Catz?!
  });