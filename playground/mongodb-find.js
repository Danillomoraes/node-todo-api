// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = ObjectID();
// console.log(obj);


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err) {
    return console.log('unable to connet to mongodb, error: '+err);
  }
    console.log('Connect to Mongo server');

  db.collection('Todos').find().toArray().then((docs) =>{

    console.log(docs);

  }, (err) => {
    if (err) {
      console.log('unable to find document', err);
    }
  });

  // db.collection('Todos').find().count().then((count) =>{
  //
  //   console.log(`Todos count: ${count}`);
  //
  // }, (err) => {
  //   if (err) {
  //     console.log('unable to find document', err);
  //   }
  // });


  db.close();

});
