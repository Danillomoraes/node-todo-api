const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');


// Todo.findOneAndRemove
// Todo.findByIdAndRemove


Todo.findByIdAndRemove('').then((todos) => {
  console.log(todos);
})

mongoose.connection.close();
