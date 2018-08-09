// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = ObjectID();
// console.log(obj);


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err) {
    return console.log('unable to connet to mongodb, error: '+err);
  }
    console.log('Connect to Mongo server');

    //delete many

    // db.collection('Todos').deleteMany({textt: 'eat lunch'}).then((result) => {
    //   console.log("deleted count: ",result);
    // }, (err) => {
    //   console.log('unable to find and delete');
    // });

    //findOneAndDelete

    db.collection('Todos').findOneAndDelete({text: 'eat lunch'}).then((result) => {
      console.log(result);
    }, (err) => {
      console.log('unable to find and delete');
    });

  db.close();
});
