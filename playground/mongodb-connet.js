// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = ObjectID();
// console.log(obj);


// MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
//   if(err) {
//     return console.log('unable to connet to mongodb, error: '+err);
//   }
//   console.log('Connect to Mongo server');
//
//   db.collection('Todo').insertOne({
//     text: 'lavar roupa',
//     completed: true
//   }, (err, result) => {
//     if(err) {
//       return console.log('Unable to insert todo', err);
//     }
//
//     console.log(JSON.stringify(result.ops, undefined, 2));
//   });
//
//   db.close();
//
// });


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('unable to connect to mongo');
  }

  db.collection('Users').insertOne({
    name: 'vagnerca',
    age: 37,
    localtion:'São paulo, SP'
  }, (err, result) => {
    if (err) {
      return console.log('Unable to insert user', err);
    }

    console.log(JSON.stringify(result.ops, undefined, 2));
  });

  db.close();

});
