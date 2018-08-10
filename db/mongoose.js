var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true, bufferCommands: false}).then(() => {
  console.log('connected to mongo');
}, (err) => {
  console.log(err);
});

module.exports = {
  mongoose
}
