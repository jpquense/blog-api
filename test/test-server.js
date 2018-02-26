const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');
const expect = chai.expect;
chai.use(chaiHttp);


describe('BlogPosts', function() {
    before(function() {
        return runServer();
    });
    after(function() {
        return closeServer();
    });

    it('should list posts on GET', function() {
        return chai.request(app)
            .get('/blog-posts')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
                const expectedKeys = ['id', 'title', 'content', 'author'];
                res.body.forEach(function(item) {
                    expect(item).to.be.a('object');
                    expect(item).to.include.keys(expectedKeys);
                });
            });
    });

    it('should add an post on POST', function() {
        const newItem = {title: 'coffee', content: 'Hello I am a fun guy blah blah blah', author: 'John Q', publishDate: 'March 30, 2018'};
        return chai.request(app)
          .post('/blog-posts')
          .send(newItem)
          .then(function(res) {
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys('id', 'title', 'content', 'author');
            expect(res.body.id).to.not.equal(null);
            expect(res.body).to.deep.equal(Object.assign(newItem, {id: res.body.id}));
          });
      });
    
      it('should update items on PUT', function() {
        const updateData = {
            title: 'foo',
            content: 'Hello i am john the wonderful',
            author: 'John Q'
        };
    
        return chai.request(app)
          .get('/blog-posts')
          .then(function(res) {
            updateData.id = res.body[0].id;
            return chai.request(app)
              .put(`/blog-posts/${updateData.id}`)
              .send(updateData);
          })
          .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.deep.equal(updateData);
          });
      });

      it('should delete items on DELETE', function() {
        return chai.request(app)
          .get('/blog-posts')
          .then(function(res) {
            return chai.request(app)
              .delete(`/blog-posts/${res.body[0].id}`);
          })
          .then(function(res) {
            expect(res).to.have.status(204);
          });
      });
});