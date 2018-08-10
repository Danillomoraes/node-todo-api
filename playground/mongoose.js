var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true, bufferCommands: false}).then(() => {
  console.log('connected to mongo');
}, (err) => {
  console.log(err);
});


var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    require: true
  },
  completed: {
    type: Boolean,
    require: true
  },
  completedAt: {
    type: Number
  }
});

var newTodo = new Todo({
  text: 'tirar roupa do varal',
  completed: false
  });

newTodo.save().then((doc) => {
  console.log('saved todo', doc);
  Todo.find().then((doc) => {
    console.log(doc);
  })
}, (e) => {
  return console.log(e);
});
