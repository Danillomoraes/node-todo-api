const mongodb = require('../db/mongodb');

var valTodo = (todo) => {
  if (todo.email.length >= 1 && todo.email != "") {
    todo.email = todo.email.trim();
    return true
  } else {
    return false
  }
}

var insertTodo = (todo) => {
  return new Promise ((resolve, rejected) => {
    var v = valTodo(todo);
    if (v) {
      mongodb.connect().then((client) => {
        client.db('TodoApp').collection('Todo').insertOne(todo).then((doc) => {
          console.log("Todo inserido", todo);
          client.close();
          resolve(todo);
        }, (err) => {
          reject(err);
        });
      }, (err) => {
        console.log('error insert', err);
      })
    } else {
      reject({error: 'invalid todo'});
    };
  });
}

module.exports = {
  valTodo,
  insertTodo
}
