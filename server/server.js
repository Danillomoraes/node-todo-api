const express = require('express');
const bodyParser = require('body-parser');

var{mongoose} = require ('./db/mongoose');
var{Todo} = require('./models/todo');
var{Users} = require('./models/users');

var app = express();

app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method}, ${req.url}`
  console.log(log);

  next();
});

app.use(bodyParser.json());

app.post('/todos', (req, res)=> {

  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc)=> {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  })

});

module.exports={app}

app.listen(3000, () => {
  console.log('Started server on port 3000');
});


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
