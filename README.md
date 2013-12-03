# Series

Compose a series of chainable async methods. Supports callbacks AND promises.

Supports Node and [Browserify](http://browserify.org/)

## Install

```
npm install series --save
```

## Usage

```js
var Series = require('series');
var series = Series();
var async = require('async'); // <~~ simply for usage example

// Add methods to our series sequence
series.add('map', function (items, iterator, next) {
  async.map(items, iterator, next);
});

series.add('sortBy', function (items, iterator, next) {
  async.sortBy(items, iterator, next);
});

series.add('filter', function (items, iterator, next) {
  var self = this;
  var error;
  
  async.filter(items, function (item, callback) {
    iterator(item, function (err, matched) {
      if (err) {
        error = err;
        return;
      }
      
      callback(matched);
    });
  }, function (filteredItems) {
    next(error, filteredItems);
  });
});

// Use our series
var list = [
  {
    name: 'John',
    age: 25
  },
  {
    name: 'Jane',
    age: 20
  }
];

series(list)
  .sortBy(function (item, next) {
    next(null, item.age);
  })
  .map(function (item, next) {
    next(null, item.age);
  }, function (err, items) {
    // Support for callbacks
  })
  .then(function (items) {
    // items now equals: [20, 25]
  }, function (err) {
    // oops, an error may have occured
  });
```

## series

The instance value returned from calling `Series()` is both a function and an object. The object is the instance and the function returns the series chain.

`series()` supports the following as initial values to start the series:

* **Primitive** - strings, numbers, etc.
* **Array** - an array of primitives or objects
* **Function** - a function that is passed a `next` callback that must be called with the following: `next(err, value)`. The value passed as the second argument becomes the initial value of the series.
* **Promise** - a [ Promises/A+](http://promises-aplus.github.io/promises-spec/) compliant value

###For example:

**Primitive**

```js
var Series = require('series');
var series = Series();

var someValue = 'my value';
series(someValue);
```

**Array**

```js
var Series = require('series');
var series = Series();

var someValue = [1,2,3,4,5];
series(someValue);
```

**Function**

```js
var Series = require('series');
var series = Series();

series(function (next) {
  var someValue = 'my value';
  next(null, someValue);
});
```

**Promise**

```js
var Series = require('series');
var Promise = require('promise'); // <~~ npm install promise 
var series = Series();

var promise = new Promise(function (resolve, reject) {
  // Some logic
});

series(promise);
```

## instance methods

These methods are available on the `series` variable.

### add(methodName, methodTask)

Composes a chainable method on the series. The method is added for all instances of that particular series.

**methodName**

A string that will be used as the method name

**methodTask**

A callback function that is passed the following parameters

* `items` - any value that you would like passed to the first method in the series
* `iterator` - the method called on the value from the previous method that performs some sort of user defined operation
* `next` - the callback once all items in the list or collection have been processed.

#### For Example:

```js
var Series = require('series');
var series = Series();

// Add methods to our series sequence
series.add('map', function (items, iterator, next) {
  iterator(items, function (err, processItems) {
    next(err, processItems);
  });
});
```

## series sequence methods

These methods are available on the value returned from calling `series(someValue)`

The methods available vary according to which methods have been added to the series. In the usage example above, we've added `map`, `sortBy`, and `filter`. These methods would be available on the series as well as:

### then(successCallback, errorCallback)

Each series sequence returns a promise. Refer to the [Promises/A+](http://promises-aplus.github.io/promises-spec/) spec for more details.

**successCallback**

This is called once all chained methods have processed the initial value, unless an error has occurred.

**errorCallback**

This is called if an error occurs anywhere when processing the initial value in any of the chainable methods. If an error occurs, all processing stops.

#### For Example:

```js
var Series = require('series');
var series = Series();

var someValue = 'my value';
series(someValue)
  .someChainableMethod(function (value, next) {
    next(null, value + 's');
  })
  .then(function (processedValue) {
    // processedValue == my values
  });
```

## Callbacks

Each method in the series can take a callback if you'd rather not use promises. Each callback will be called at the completion of each method.

#### For Example:

```js
var Series = require('series');
var series = Series();

series(someValue)
  .someChainableMethod(function (value, next) {
    next(null, value + 's');
  }, function (err, arg1) {
    // arg1 == value + 's'
  })
  .someOtherMethod(function (value, next) {
    next(null);
  }, function (err) {
    // err == null
  })
```

## Run Tests

```
npm install
npm test
```
