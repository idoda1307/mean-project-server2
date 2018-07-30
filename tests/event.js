var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;

var mongoose = require('mongoose');
require('sinon-mongoose');

var User = require('../models/event');

describe("Get all events", function(){
    // Test will pass if we get all events
   it("should return all events", function(done){
       var EventMock = sinon.mock(Event);
       var expectedResult = {status: true, event: []};
       EventMock.expects('find').yields(null, expectedResult);
       Event.find(function (err, result) {
           EventMock.verify();
           EventMock.restore();
           expect(result.status).to.be.true;
           done();
       });
   });

   // Test will pass if we fail to get a event
   it("should return error", function(done){
       var EventMock = sinon.mock(Event);
       var expectedResult = {status: false, error: "Something went wrong"};
       EventMock.expects('find').yields(expectedResult, null);
       Event.find(function (err, result) {
           EventMock.verify();
           EventMock.restore();
           expect(err.status).to.not.be.true;
           done();
       });
   });
});


 // Test will pass if the event is saved
 describe("Post a new event", function(){
    it("should create new post", function(done){
        var EventMock = sinon.mock(new Event({ event: 'Save new event from mock'}));
        var event = EventMock.object;
        var expectedResult = { status: true };
        EventMock.expects('save').yields(null, expectedResult);
        event.save(function (err, result) {
            EventMock.verify();
            EventMock.restore();
            expect(result.status).to.be.true;
            done();
        });
    });
    // Test will pass if the event is not saved
    it("should return error, if post not saved", function(done){
        var EventMock = sinon.mock(new Event({ event: 'Save new event from mock'}));
        var event = EventMock.object;
        var expectedResult = { status: false };
        EventMock.expects('save').yields(expectedResult, null);
        event.save(function (err, result) {
            EventMock.verify();
            EventMock.restore();
            expect(err.status).to.not.be.true;
            done();
        });
    });
});

// Test will pass if the event is updated based on an ID
describe("Update a new event by id", function(){
    it("should updated a event by id", function(done){
      var EventMock = sinon.mock(new Event({ completed: true}));
      var event = EventMock.object;
      var expectedResult = { status: true };
      EventMock.expects('save').withArgs({_id: 12345}).yields(null, expectedResult);
      event.save(function (err, result) {
        EventMock.verify();
        EventMock.restore();
        expect(result.status).to.be.true;
        done();
      });
    });
    // Test will pass if the event is not updated based on an ID
    it("should return error if update action is failed", function(done){
      var EventMock = sinon.mock(new Event({ completed: true}));
      var event = EventMock.object;
      var expectedResult = { status: false };
      EventMock.expects('save').withArgs({_id: 12345}).yields(expectedResult, null);
      event.save(function (err, result) {
        EventMock.verify();
        EventMock.restore();
        expect(err.status).to.not.be.true;
        done();
      });
    });
  });

   // Test will pass if the event is deleted based on an ID
   describe("Delete a event by id", function(){
    it("should delete a event by id", function(done){
        var EventMock = sinon.mock(Event);
        var expectedResult = { status: true };
        EventMock.expects('remove').withArgs({_id: 12345}).yields(null, expectedResult);
        Event.remove({_id: 12345}, function (err, result) {
            EventMock.verify();
            EventMock.restore();
            expect(result.status).to.be.true;
            done();
        });
    });
    // Test will pass if the event is not deleted based on an ID
    it("should return error if delete action is failed", function(done){
        var EventMock = sinon.mock(Event);
        var expectedResult = { status: false };
        EventMock.expects('remove').withArgs({_id: 12345}).yields(expectedResult, null);
        Event.remove({_id: 12345}, function (err, result) {
            EventMock.verify();
            EventMock.restore();
            expect(err.status).to.not.be.true;
            done();
        });
    });
});

