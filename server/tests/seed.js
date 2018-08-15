const {ObjectId} = require('mongodb');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user')
const id = '5b71bd046bcfe526c4aa603d';

const todos = [
  {
    text: "test 1"
  },
  {
    _id: new ObjectId(id),
    text: 'test 2'
  }
];

const populateTodos = (done) => {
  Todo.deleteMany({}).then(()=> {
      Todo.insertMany(todos).then(()=>{done()})
  });
};

const users = [
  {
    email: "danillom@example.com",
    password: "danillom"
  },
  {
    email: "danillom",
    password: "danillom"
  },
  {
    email: "danillo.m@example.com",
    password: "asd"
  }
];

const populateUsers = (done) => {
  User.deleteMany({}).then(()=> {
    // User.insertOne(users[0]).then(()=>{done()})
  });
};


module.exports = {users, todos, populateTodos}
