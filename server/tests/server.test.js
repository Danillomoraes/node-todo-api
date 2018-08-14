const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const id = '5b71bd046bcfe526c4aa603d';
const todos = [
  {
    text: "test 1"
  },
  {
    _id: new ObjectId(id),
    text: 'test 2'
  }
];


beforeEach((done) => {
  Todo.deleteMany({}).then(()=> {
      Todo.insertMany(todos).then(()=>{done()})
  });
});

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

        Todo.find({text}).then ((todos)=> {
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
      .get('/todos/5b71bd046bcfe526c4aa603d')
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(id);
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
      .patch(`/todos/${id}`)
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
      .patch(`/todos/${id}`)
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
      .delete(`/todos/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(id);
      })
      .end((err, res)=> {
        if (err) {
          return done(err)
        }

        Todo.findById(id).then((todo) => {
          expect(todo).toBe(null);
          done();
        }).catch((e)=> {
          return done(e)
        });
      });
  });

});
