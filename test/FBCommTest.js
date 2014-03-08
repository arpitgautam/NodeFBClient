//Unit test case for communicator
var assert = require("assert"),
sinon = require('sinon'),
Q = require("Q"),
https = require('https'),
http = require('http'),
Readable = require('stream').Readable,
Writable = require('stream').Writable,
communicatorModule = require('../src/FBGraphAPICommunicator');

describe('Communicator', function () {

    var dummyToken = "dummy";
    var communicator = new communicatorModule.FaceBookGraphAPICommunicator(
			dummyToken);
    var writableStream = new Writable;
    //need real implementation of Readable stream so that events work and can be tested
    var readableStream = new Readable;
    readableStream._read = function (n) { };


    beforeEach(_setup);
    afterEach(_tearDown);

    function _setup(done) {
        var httpReqStub = sinon.stub(https, 'request');
        httpReqStub.returns(writableStream);
        httpReqStub.yields(readableStream);
        done();
    }

    function _tearDown(done) {
        https.request.restore();
        done();
    }

    describe('User Fetcher constructor takes parmas correctly', function () {
        it('should accpet token coreectly', function () {
            assert.equal(communicator.token, dummyToken);
        });

        it('should set path correctly', function () {
            communicator.setPath("path");
            assert.equal(communicator.path, "path");
        });
    });

    describe('sending data function', function () {
        it('should return data sent via various data events', function (complete) {
            var sendPromise = communicator.send();
            sendPromise.then(function () {
                complete();
            }, function () { }).done();
            readableStream.emit('data', '123');
            readableStream.emit('data', '456');
            readableStream.emit('end');
            assert.equal(communicator.data, '123456');
        });

        it('should not resolve promise without recieveing end event', function () {

            var sendPromise = communicator.send();
            sendPromise.then(function () {
            }, function () { }).done();
            readableStream.emit('data', '123');
            readableStream.emit('data', '456');
            //TO Be implemented

        });

        it('should call send correctly for failures', function (completed) {
            var sendPromise = communicator.send();
            sendPromise.then(function () { }, function (e) {
                assert.equal(e, 'Network Timeout');
                completed();
            }).done();
            writableStream.emit('error', 'Network Timeout');         
        });
    });

});