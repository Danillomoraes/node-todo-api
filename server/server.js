const express = require('express');
const bodyParser = require('body-parser');

var{mongoose} = require ('../db/mongoose');
var Todo  = require('../models/todo');
var Users = require('../models/users');

var app = express();

app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method}, ${req.url}`
  console.log(log);

  next();
});

app.use(bodyParser.json());

app.post('/todo', (req, res)=> {
  var todo = {
    email: req.body.email,
    text: req.body.todo
  };
  Todo.insertTodo(todo).then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  })
});

app.listen(3000, () => {
  console.log('Started server on port 3000');
})

//
//
// const {MongoClient, ObjectID} = require('mongodb');
//
// var connect = (callback) => {
//
//
//     var db = client.db('TodoApp');
//
//     callback(db);
//
//     client.close();
//
//   });
//
// }
//
// var connectP = new Promise ((resolve, reject) => {
//
//   MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, client) => {
//     if (err) {
//       reject('erro connect mongo: '+err);
//     }
//
//     // var db = client.db('TodoApp');
//
//     resolve(client);
// });
//
//
// var insertUser = (db, user, callback) => {
//
//   db.collection('Users').insertOne(user).then((doc) => {
//     console.log('user added: ');
//     callback(doc);
//   }, (err) => {
//     console.log('error added user: ', err);
//     callback(undefined, err);
//   });
//
// }
//
//
// var user =  {
//   email: 'danillom@example.com'
// };
//
// connect((db) => {
//   // insertUser(db, user, (err, doc) => {
//   //   if (doc) {
//   //     console.log(doc);
//   //   }
//   console.log('connected via callback');
//   })
// });
//
// connectP.then((client) => {
//   console.log('connected to mongo via promises');
//   var Todos = client.db('TodoApp').collection('Todo').find().toArray().then((docs)=>{
//     console.log(docs);
//     client.close();
//   }, (err) => {
//     console.log('error promises');
//     client.close();
//   });
// }, (err) => {
//   console.log(err);
// })
//
// // Mongoose way, didnt work on x86 mongo version
//
// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true, bufferCommands: false}).then(() => {
//   console.log('connected to mongo');
// }, (err) => {
//   console.log(err);
// });
//
//
//
// var newTodo = new Todo({
//   text: 'tirar roupa do varal'
//   });
//
// newTodo.save().then((doc) => {
//   console.log('saved todo', doc);
//   mongoose.disconnect();
// }, (e) => {
//   return console.log(e);
// });
//
//
//
// var user = new User({
//
// });
//
// user.save().then((doc)=> {
//   console.log('User saved', doc);
// }, (err) => {
//   console.log('Unable to save user', err);
// });
