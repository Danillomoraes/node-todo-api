var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// mongoose.createConnection('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true, bufferCommands: false})
mongoose.connect(process.env.MONGODB_URI, {bufferCommands: false})

module.exports = {mongoose}
