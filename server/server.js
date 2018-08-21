require('./config/config.js');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var{mongoose} = require('./db/mongoose');
var{ObjectID} = require('mongodb');
var{Todo} = require('./models/todo');
var{User} = require('./models/user');
var{authenticate} = require('./middleware/authenticate');

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
      return res.status(404).send({});
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  })

});

// DELETE's requests

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    res.status(404).send({});
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo) {
      return res.status(404).send({});
    }
    res.send({todo});
  }).catch((e)=> {
    res.status(400).send();
  });

});

//PATCH's requests

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if(!ObjectID.isValid(id)) {
    res.status(404).send({});
  }

  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if(!todo) {
      return res.status(404).send({});
    }

    res.send({todo});
  }).catch((e)=>{
    res.status(400).send();
  });
});

//POST /users

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
    // res.send(doc);
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });

});

//POST users/login

app.post('/users/login', (req, res) => {
  var body= _.pick(req.body, ['email', 'password']);
  var hashPass

  User.findOne({email: body.email}).then((user) => {
    if (!user) {
      return res.status(401).send({});
    }
    //
    // bcrypt.genSalt(10, (err, salt) => {
    //   bcrypt.hash(body.password, salt, (err, hash) => {
    //     hashPass = hash;
    //   });
    // });
    console.log(user);
    bcrypt.compare(body.password, user.password, (err, res)=> {
      if(res) {
          res.send({user});
      } else {
        res.status(401).send({});
      }
    });
  });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

module.exports={app}

app.listen(process.env.PORT, () => {
  console.log(`Started server on port ${process.env.PORT}`);
});
