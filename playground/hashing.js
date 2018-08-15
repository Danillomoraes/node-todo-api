const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
  id: 10
};

var token = jwt.sign(data, '123asd');
console.log(token);

var decoded = jwt.verify(token, '123asd');
console.log(decoded);


// var message = 'Iam user number 3';
// var hash = SHA256(message).toString();
//
// console.log(message);
// console.log(hash);
//
// var data = {
//   id: 4
// };
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data)+'somesecret').toString()
// }
//
// // token.data.id =5;
// // token.hash= SHA256(JSON.stringify(token.data)).toString();
//
// var resHash = SHA256(JSON.stringify(token.data)+'somesecret').toString();
//
// if(resHash === token.hash) {
//   console.log('data was not change');
// } else{
//   console.log('data was changed');
// }
