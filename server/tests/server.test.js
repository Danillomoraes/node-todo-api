const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {User} = require('./../models/user');
const {Todo} = require('./../models/todo');
const {todos, users, populateUsers, populateTodos} = require('./seed.js');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('/todos', () => {
  describe('POST /todos', () => {
    it('should create a new todo', (done) => {
      var text = "teste todo";

      request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos)=> {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
    });

    it('should not create new todo', (done) => {
      request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
    });

  });

  describe('GET /todos', () => {

    it('should return all todos', (done) => {

      request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2)
      })
      .end(done);
    });

    it('should return one todo', (done) => {
      request(app)
      .get(`/todos/${todos[1]._id}`)
      .expect(200)
      .expect((res) => {
        expect(ObjectId(res.body.todo._id)).toEqual(todos[1]._id);
      })
      .end(done);
    })

    it('should return 404 if not found', (done) => {

      request(app)
      .get('/todos/6b71bd046bcfe526c4aa603d')
      .expect(404)
      .end(done);
    });

    it('should return 400 if sent invalid id', (done)=> {
      request(app)
      .get('/todos/1234')
      .expect(400)
      .end(done);
    })

  });
  describe('PATCH /todos/:id', () => {
    var body = {
      completed : true,
      text : 'update todo'
    };

    it('should return 404 invalid', (done)=> {
      request(app)
      .patch('/todos/32165')
      .send(body)
      .expect(404)
      .end(done);
    });
    it('should return 404 not found', (done) => {
      request(app)
      .patch('/todos/6b71bd046bcfe526c4aa603d')
      .expect(404)
      .end(done);
    });

    it('should update the note', (done) => {
      request(app)
      .patch(`/todos/${todos[1]._id}`)
      .send(body)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        it('should return timestamp and completed be true', () => {
          expect(res.body.todo.completedAt).toBeA(Date);
          expect(res.boby.todo.completed).toBe(true);
        });
        done();
      });
    });
    it('should set completedAt null if omited completed', (done) => {
      request(app)
      .patch(`/todos/${todos[1]._id}`)
      .send({text: 'something new test'})
      .expect(200)
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBe(null);
        done();
      });


    });
  });

  describe('DELETE /todos/:id', () => {
    it('should return 404 invalid', (done)=> {
      request(app)
      .delete('/todos/32165')
      .expect(404)
      .end(done);
    });
    it('should return 404 not found', (done) => {
      request(app)
      .delete('/todos/6b71bd046bcfe526c4aa603d')
      .expect(404)
      .end(done);
    })
    it('should delete note', (done) => {
      request(app)
      .delete(`/todos/${todos[1]._id}`)
      .expect(200)
      .expect((res) => {
        expect(ObjectId(res.body.todo._id)).toEqual(todos[1]._id);
      })
      .end((err, res)=> {
        if (err) {
          return done(err)
        }

        Todo.findById(todos[1]._id).then((todo) => {
          expect(todo).toBe(null);
          done();
        }).catch((e)=> {
          return done(e)
        });
      });
    });

  });
});

describe ('/users', () => {
  describe('GET /users/me', (done) => {
    // GET /users/me
    it('should return user if authenticated', (done) => {
      request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      }).end(done);

    });
    //             -> reject without header auth
    it('should return 401 if not authenticated', (done)=> {
      request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done)
    });
  });

  describe('POST /users', () => {
    // Post /users
    //             -> reject user with invalid data
    it('should create a user', (done) => {
      request(app)
      .post('/users')
      .send(users[2])
      .expect(200)
      .end(done);
    });
    it('reject insert user with invalid password', (done) => {
      request(app)
      .post('/users')
      .send(users[3])
      .expect(400)
      .end(done);
    });
    it('should reject user with email already saved', (done) => {
      request(app)
        .post('/users')
        .send(users[0])
        .expect(400)
        .end(done);
    });
  });
  describe('POST /users/login', () => {

    it('should not login the user', (done) => {
      request(app)
      .post('/users/login')
      .send({
        email: "daasdnillom@example.com",
        password: "daasdnillom"
      })
      .expect(400)
      .expect((res)=> {
        expect(res.header['x-auth']).toBe(undefined);
      })
      .end(done)
    });
    it('should login the user', (done)=> {
      request(app)
      .post('/users/login')
      .send({
        email: users[0].email,
        password: users[0].password
      })
      .expect(200)
      .expect((res)=> {
        expect(res.body.email).toBe(users[0].email);
        // console.log(res.header);
        expect(res.header[1]).toBe(users[0].tokens.token);
      }).end(done);
    });
  });
  describe('DELETE /users/me/token', () => {
    it('should reject request without auth hearder', (done) => {
      request(app)
        .delete('/users/me/token')
        .expect(401)
        .end(done);
    });
    it('should return 400 with wrong header', (done)=> {
      request(app)
        .delete('/users/me/token')
        .set('x-auth','asodnasojdasojd')
        .expect(401)
        .end(done);
    });
    it('should remove auth token', (done) => {
      request(app)
        .delete('/users/me/token')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res)=> {
          User.findByToken(users[0].tokens[0].token).then((user) => {
            expect(user).toBe(null);
          });
        })
        .end(done);
    });
  });

});
