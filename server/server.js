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

app.post('/todos', authenticate, (req, res)=> {

  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc)=> {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });

});

//GET's requests

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    res.status(400).send({});
  }

  Todo.findOne({_id: id, _creator: req.user._id}).then((todo) => {
    if(!todo){
      return res.status(404).send({});
    }

    res.send({todo});
  }).catch((e) => {
    // console.log(e);
    res.status(400).send();
  })

});

// DELETE's requests

app.delete('/todos/:id', authenticate,  (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send({});
  }

  Todo.find({_id: id, _creator: req.user._id}).then((todo) => {
    // console.log(todo);
    if (todo) {
      Todo.deleteOne({_id: id, _creator: req.user._id}, (err,resp) => {
        if (resp.result.n ===0) {
          return res.status(404).send({})
        }
      res.send({todo: {_id: id}})
    })
    } else {
      res.status(404).send({})
    }
  }).catch((e)=> {
    res.status(400).send({})
  });

  });

  // Todo.findByIdAndRemove(id).then((todo) => {
  //   if(!todo) {
  //     return res.status(404).send({});
  //   }
  //   res.send({todo});
  // }).catch((e)=> {
  //   res.status(400).send();
  // });

//PATCH's requests

app.patch('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if(!ObjectID.isValid(id)) {
    return res.status(404).send({});
  }

  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.updateOne({_id: id, _creator: req.user._id}, {$set: body}, (err, resp) => {
    // console.log(resp);
    if (resp.n===0) {
      // console.log(err);
      return res.status(404).send({});
    }
    Todo.find({_id: id, _creator: req.user._id}).then((todo)=> {
      res.send({todo: body});

    }).catch((e) => {
      res.status(400).send({});
    })
  });

  // Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
  //   if(!todo) {
  //     return res.status(404).send({});
  //   }
  //
  //   res.send({todo});
  // }).catch((e)=>{
  //   res.status(400).send();
  // });
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
  User.findByCredentials(body.email, body.password).then((user) => {
    // res.send(user);
    return user.generateAuthToken().then((token)=> {
      res.header('x-auth', token).send(user);
    })
  }).catch((e)=>{
    res.status(400).send();
  });

});

app.delete('/users/me/token',authenticate, (req, res) => {
  req.user.removeToken(req.token).then(()=> {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

module.exports={app}

app.listen(process.env.PORT, () => {
  console.log(`Started server on port ${process.env.PORT}`);
});
