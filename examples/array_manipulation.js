// var Series = require('../');
// var users = Series();

// users.add('compareAge', function (_users, iterator, next) {
//   var filteredUsers = [];
//   var user = _users.shift();
  
//   if (user) doSomething(user);
//   else next(null, filteredUsers);
  
//   function doSomething (user) {
//     if (!user) return next(null, filteredUsers);
    
//     iterator(user, function (err, matched) {
//       if (matched) filteredUsers.push(user);
      
//       user = _users.shift();
      
//       if (user) return doSomething();
//       else return next(null, filteredUsers);
//     });
//   }
// });

// var userList = [
//   {
//     name: 'Scott',
//     age: 29
//   },
//   {
//     name: 'Lindsay',
//     age: 25
//   },
//   {
//     name: 'Joe',
//     age: 28
//   }
// ];

// users(userList)
//   .compareAge(function (user, next) {
//     if (user.age > 27) next(null, true);
//     else next(null);
//   })
//   .then(function (filteredUsers) {
//     console.log(filteredUsers);
//   });