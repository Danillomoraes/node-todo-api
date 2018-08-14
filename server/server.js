const express = require('express');
const bodyParser = require('body-parser');

var{mongoose} = require('./db/mongoose');
var{ObjectID} = require('mongodb');
var{Todo} = require('./models/todo');
var{Users} = require('./models/users');

var app = express();

app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method}, ${req.url}`
  // console.log(log);

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
  });

});

//GET's requests

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    res.status(400).send({});
  }

  Todo.findById(id).then((todo) => {
    if(!todo){
      res.status(404).send({});
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  })

});

module.exports={app}

app.listen(3000, () => {
  console.log('Started server on port 3000');
});
