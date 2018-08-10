const mongodb = require('../db/mongodb');

var valUser = (user) => {
  if (user.email != "" && user.email.length >= 1) {
    user.email = user.email.trim();
    return true
  } else {
    return false
  }
}

var insertUser = (user) => {
  return new Promise ((resolve, rejected) => {
    if (valUser(user)) {
      console.log('val pass');
      mongodb.connect().then((client) => {
        client.db('TodoApp').collection('Todo').insertOne(user).then((doc) => {
          console.log("User inserido", user);
          client.close();
          resolve(user);
        }, (err) => {
          reject(err);
        });
      }, (err) => {
        console.log('error insert', err);
      })
    } else {
      reject({error: 'invalid user'});
    };
  });
}

module.exports = {
  valUser,
  insertUser
}
