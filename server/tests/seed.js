const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');


const id = '5b71bd046bcfe526c4aa603d';
const userOneId = new ObjectId();
const userTwoId = new ObjectId();

const todos = [
  {
    text: "test 1",
    _creator: userOneId
  },
  {
    _id: new ObjectId(id),
    text: 'test 2',
    _creator: userTwoId
  }
];

const populateTodos = (done) => {
  Todo.deleteMany({}).then(()=> {
      Todo.insertMany(todos).then(()=>{done()})
  });
};

const users = [
  {
    _id: userOneId,
    email: "danillom@example.com",
    password: "danillom",
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  },
  {
    _id: userTwoId,
    email: "danillomasd@example.com",
    password: "danillom",
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  },
  {
    email: "danillo.m@example.com",
    password: "asdasda"
  },
  {
    email: 'dnaillom@example.com',
    password: 'asd'
  }
];

const populateUsers = (done) => {
  User.deleteMany({}).then(()=> {
    // console.log(users[0]);
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(()=> {
    done()
  }).catch((e) =>{
    done(e);
  });
};


module.exports = {users, todos, populateTodos, populateUsers}
