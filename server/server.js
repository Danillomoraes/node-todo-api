// var mongoose = require('mongoose');
const {MongoClient, ObjectID} = require('mongodb');

var connect = (callback) => {

  MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, client) => {
    if (err) {
      console.log('erro connect mongo', err);
    }
    console.log('connected to mongo');

    var db = client.db('TodoApp');

    callback(db);

    client.close();

  });

}

var insertUser = (db, user, callback) => {

  db.collection('Users').insertOne(user).then((doc) => {
    console.log('user added: ');
    callback(doc);
  }, (err) => {
    console.log('error added user: ', err);
    callback(undefined, err);
  });

}


var user =  {
  email: 'danillom@example.com'
};

connect((db) => {
  insertUser(db, user, (err, doc) => {
    if (doc) {
      console.log(doc);
    }
  })
});




// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true, bufferCommands: false}).then(() => {
//   console.log('connected to mongo');
// }, (err) => {
//   console.log(err);
// });
//
// var Todo = mongoose.model('Todo', {
//   text: {
//     type: String
//   },
//   completed: {
//     type: Boolean
//   },
//   completedAt: {
//     type: Number
//   }
// });

// var newTodo = new Todo({
//   text: 'tirar roupa do varal'
//   });
//
// newTodo.save().then((doc) => {
//   console.log('saved todo', doc);
//   mongoose.disconnect();
// }, (e) => {
//   return console.log(e);
// });
