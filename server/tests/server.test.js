const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const todos = [
  {
    text: "test 1"
  },
  {
    _id: new ObjectId('5b71bd046bcfe526c4aa603d'),
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
        expect(res.body.todo._id).toBe('5b71bd046bcfe526c4aa603d');
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
