const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

var id = '5b71bd046bcfe526c4aa603c';

if(!ObjectID.isValid(id)) {
  console.log('ID not valid');
}

Todo.findById(id).then((todo) => {
  console.log('Todo by Id', todo);
});
