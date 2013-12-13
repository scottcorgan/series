// var Series = require('../');
// var users = Series();

// users.add('compareAge', function (_users, iterator, next) {
//   iterator(_users, function (err, user) {
//     console.log(err, user);
//     next(err, user);  
//   });
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
//     if (user.age > 27) next(null, user);
//     else next(null);
//   })
//   .then(function (filteredUsers) {
//     console.log(filteredUsers);
//   });