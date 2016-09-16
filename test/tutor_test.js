'use strict';
process.env.MONGO_URI = 'mongodb://localhost:27017/s3-test';
require('../index');
let mongoose = require('mongoose');
let chai = require('chai');
let chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
let expect = chai.expect;


var token;
var sessionsId;
var tablesId;
var subjectsId;
describe('RESTful API', function() {

  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });

  describe('Users route', function() {



    it('should be able to create a new user', function(done) {
      chai.request('localhost:3000')
        .post('/users')
        .send({name: 'mike', password: 'password'})
        .end(function(err, res) {
          expect(err).to.eql(null);
          expect(res.body.message).to.eql('New user created');
          done();
        });
    });

    it('should be able to login a user', function(done) {
      chai.request('localhost:3000')
        .post('/login')
        .auth('mike', 'password')
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body).to.have.property('token');
          done();
        });
    });

  });

  describe('Sessions routes', function() {



    it ('should be able to create a session', function(done) {
      chai.request('localhost:3000')
        .post('/sessions')
        .send({table : '17', subject : 'Algebra 1'})
        .end((err, res) => {
          sessionsId = res.body.data._id;
          expect(err).to.eql(null);
          expect(res.body.message).to.eql('You have been added to the queue.');
          done();
        });
    });

    it ('should be able to get sessions', function(done) {
      chai.request('localhost:3000')
        .get('/sessions')
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(Array.isArray(res.body)).to.eql(true);
          done();
        });
    });

    it ('should be able to update a session', function(done) {
      chai.request('localhost:3000')
        .put('/sessions/'+sessionsId)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body.message).to.eql('Updated session');
          done();
        });
    });

    it ('should be able to delete a session', function(done) {
      chai.request('localhost:3000')
        .del('/sessions/'+sessionsId)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body.message).to.eql('Session removed');
          done();
        });
    });

  });

  describe('Tables routes', function() {

    beforeEach((done) => {
      chai.request('localhost:3000')
        .post('/login')
        .auth('mike', 'password')
        .end((err, res) => {
          token = res.body.token;
          expect(err).to.eql(null);
          expect(res.body).to.have.property('token');
          done();
        });
    });



    it ('should create a list ', function(done) {
      chai.request('localhost:3000')
        .post('/admin/tables')
        .set('authorization', token)
        .send({tables: ['A7']})
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body).to.have.property('_id');
          done();
        });
    });

    it ('should return an array table ', function(done) {
      chai.request('localhost:3000')
        .get('/admin/tables')
        .set('authorization', token)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(Array.isArray(res.body)).to.eql(true);
          done();
        });
    });
  });

  describe('Create a table Id', () => {

    beforeEach((done) => {
      chai.request('localhost:3000')
        .post('/admin/tables')
        .set('authorization', token)
        .send({tables: ['A8']})
        .end((err, res) => {
          tablesId = res.body._id;
          done();
        });
    });

    it ('should update a table ', function(done) {
      chai.request('localhost:3000')
        .put('/admin/tables/'+tablesId)
        .set('authorization', token)
        .send({tables: ['A7']})
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body.message).to.eql('Table updated');
          done();
        });
    });

    it ('should delete tables', function(done) {
      chai.request('localhost:3000')
        .del('/admin/tables')
        .set('authorization', token)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.text).to.eql('Tables deleted!');
          done();
        });
    });
  });



  describe('Subjects routes', function() {

    beforeEach((done) => {
      chai.request('localhost:3000')
        .post('/admin/subjects')
        .set('authorization', token)
        .send({subjects: 'Algebra'})
        .end((err, res) => {
          subjectsId = res.body._id;
          done();
        });
    });

    it ('should create a subject ', function(done) {
      chai.request('localhost:3000')
        .post('/admin/subjects')
        .set('authorization', token)
        .send({subjects: ['Math']})
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body).to.have.property('subjects');
          done();
        });
    });

    it ('should return an array of subjects ', function(done) {
      chai.request('localhost:3000')
        .get('/admin/subjects')
        .set('authorization', token)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(Array.isArray(res.body)).to.eql(true);
          done();
        });
    });

    it ('should update a subject ', function(done) {
      chai.request('localhost:3000')
        .put('/admin/subjects/'+subjectsId)
        .set('authorization', token)
        .send({subjects: ['Statistics']})
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body.message).to.eql('Subject updated');
          done();
        });
    });

    it ('should delete a subject ', function(done) {
      chai.request('localhost:3000')
        .del('/admin/subjects')
        .set('authorization', token)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.text).to.eql('Subjects deleted!');
          done();
        });
    });

  });

  describe('Download sessions to csv file', () => {
    it('should download a csv file', (done) => {
      chai.request('localhost:3000')
        .get('/admin/downloads')
        .set('authorization', token)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.text).to.eql('File exported');
          done();
        });
    });
  });

  describe('Email sessions data in csv file', () => {
    it('should email a csv file', (done) => {
      chai.request('localhost:3000')
        .post('/admin/email')
        .set('authorization', token)
        .send({email:'abc@123.com'})
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.text).to.eql('Email sent');
          done();
        });
    });
  });

  describe('Archiving session data', () => {
    it('should return and array of archived data', (done) => {
      chai.request('localhost:3000')
        .get('/admin/archive')
        .set('authorization', token)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(Array.isArray(res.body)).to.eql(true);
          done();
        });
    });

    it('should add session data to archive collection', (done) => {
      chai.request('localhost:3000')
        .post('/admin/archive')
        .set('authorization', token)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body).to.equal('Archive complete');
          done();
        });
    });

    it('should delete archive collection', (done) => {
      chai.request('localhost:3000')
        .del('/admin/archive')
        .set('authorization', token)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.text).to.eql('Archive emptied');
          done();
        });
    });
  });

});
