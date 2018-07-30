var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;

var mongoose = require('mongoose');
require('sinon-mongoose');

var User = require('../models/user');

describe("Create a new user", function(){
    it("should create new user", function(done){
        var UserMock = sinon.mock(new User({ user: 'Save new user from mock'}));
        var user = UserMock.object;
        var expectedResult = { status: true };
        UserMock.expects('save').yields(null, expectedResult);
        user.save(function (err, result) {
            UserMock.verify();
            UserMock.restore();
            expect(result.status).to.be.true;
            done();
        });
    });
    // Test will pass if the user is not saved
    it("should return error, if user not saved", function(done){
        var UserMock = sinon.mock(new User({ user: 'Save new user from mock'}));
        var user = UserMock.object;
        var expectedResult = { status: false };
        UserMock.expects('save').yields(expectedResult, null);
        user.save(function (err, result) {
            UserMock.verify();
            UserMock.restore();
            expect(err.status).to.not.be.true;
            done();
        });
    });
});
