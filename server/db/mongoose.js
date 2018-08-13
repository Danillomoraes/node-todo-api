var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// mongoose.createConnection('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true, bufferCommands: false})
mongoose.connect('mongodb://localhost:27017/TodoApp', {bufferCommands: false})

module.exports = {mongoose}
