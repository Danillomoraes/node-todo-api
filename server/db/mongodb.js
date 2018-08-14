const {MongoClient, ObjectID} = require('mongodb');

var connect = () => {
  return new Promise ((resolve, reject) => {
    MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/TodoApp", { useNewUrlParser: true }, (err, client) => {
      if (err) {
        reject('erro connect mongo: '+err);
      }

      resolve(client);
    });
  });
};

module.exports = {connect}
