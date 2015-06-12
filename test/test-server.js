var chai = require('chai');
var chaiHttp = require('chai-http');

global.environment = 'test';
var server = require('../server.js');
var Item = require('../models/item');
var seed = require('../db/seed');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Shopping List', function() {
    before(function(done) {
        seed.run(function() {
            done();
        });
    });

    after(function(done) {
        Item.remove(function() {
            done();
        });
    });
  
    it('should list items on get', function(done){
      chai.request(app)
        .get('/items')
        .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            res.body.should.have.length(3);
            res.body[0].should.be.a('object');
            res.body[0].should.have.property('name');
            res.body[0].name.should.be.a('string');
            res.body[0].name.should.equal('Broad beans');
            res.body[1].name.should.equal('Tomatoes');
            res.body[2].name.should.equal('Peppers');
            done();
      });
    });
    var newItemID;  
    it('should add an item on post', function(done){
        chai.request(app)
           .post('/items/')
           .send({name: 'Bananas'})
           .end(function(err, res){
               res.should.have.status(201);
               res.should.be.json;
               res.body.should.be.a('object');
               res.body.should.have.property('name');
               res.body.name.should.equal('Bananas');
               res.body.should.have.property('_id');     
               newItemID = res.body._id;         
               done();
        });
    });
  
    it('should edit an item on put', function(done){
        chai.request(app)
           .put('/items/'+newItemID)
           .send({'name': 'Green Beans'})
           .end(function(err, res){
               res.should.have.status(200);
               res.should.be.json;
               res.body.should.be.a('object');
               res.body.should.have.property('name');
               res.body.name.should.equal('Green Beans');

              done();
        });
    });
    it('should delete an item on delete', function(done){
         chai.request(app)
           .delete('/items/'+newItemID)
           .end(function(err, res){
               res.should.have.status(200);
               res.should.be.json;
               res.body.should.be.a('object');
               res.body.should.have.property('_id');
               res.body.should.have.property('name');
               res.body._id.should.be.equal(newItemID);
               res.body.name.should.equal('Green Beans');
               done();
        });     
    });
    it('should return 404 if deleting an element that does not exist', function(done){
         chai.request(app)
           .delete('/items/'+newItemID)
           .end(function(err, res){
               res.should.have.status(404);
               done();
        });      
    });
    it('should return 404 if trying to add an item without sending a name', function(done){
         chai.request(app)
           .put('/items/10')
           .end(function(err, res){
               res.should.have.status(404);
               done();
        });      
    });  
});