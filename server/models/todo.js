var mongoose = require('mongoose');

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

module.exports = {Todo}
