// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = ObjectID();
// console.log(obj);


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err) {
    return console.log('unable to connet to mongodb, error: '+err);
  }

  console.log('Connect to Mongo server');

  db.collection('Todos').findOneAndUpdate( {
    _id: new ObjectID("5b6b4e6ec158f920a0814e98")
  }, {
    $set: {
      completed: true
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  }, (err) => {
    console.log("error: ",err);
  })


  db.close();
});
