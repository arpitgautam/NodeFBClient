//Unit test case for communicator
var assert = require("assert"),
sinon = require('sinon'),
Q = require("Q"),
https = require('https'),
Readable = require('stream').Readable,
Writable = require('stream').Writable,
communicatorModule = require('../src/FBGraphAPICommunicator');

describe('Communicator', function () {

    var dummyToken = "dummy";
    var writableStream = new Writable;
    var communicator;
    //need real implementation of Readable stream so that events work and can be tested
    var readableStream = new Readable;
    readableStream._read = function (n) { };


    beforeEach(_setup);
    afterEach(_tearDown);

    function _setup() {
        communicator = new communicatorModule.FaceBookGraphAPICommunicator(
			dummyToken);
        var httpReqStub = sinon.stub(https, 'request');
        httpReqStub.returns(writableStream);
        httpReqStub.yields(readableStream);
    }

    function _tearDown() {
        https.request.restore();
    }

    describe('should take paramters correctly', function () {
        it('should accpet token coreectly', function () {
            assert.equal(communicator.token, dummyToken);
        });

        it('should set path correctly', function () {
            communicator.setPath("path");
            assert.equal(communicator.path, "path");
        });
    });

    describe('sending data function', function () {
        it('should call send() correctly for failures', function (complete) {
            var sendPromise = communicator.send();
            sendPromise.then(function () {
                complete();
            }, function () { }).done();
            readableStream.emit('data', '123');
            readableStream.emit('data', '456');
            readableStream.emit('end');
            assert.equal(communicator.data, '123456');
        });

        it('should call send() correctly for failures', function (completed) {
            var sendPromise = communicator.send();
            sendPromise.then(function () { }, function (e) {
                assert.equal(e, 'Network Timeout');
                completed();
            }).done();
            writableStream.emit('error', 'Network Timeout');
        });
    });

    describe('parsing friend data', function () {
        it('should parse success correctly for next url', function (complete) {
            var data = JSON.stringify({
                "data": [
                        {
                            "name": "Garima Sharma",
                            "id": "514749621"
                        },
                        {
                            "name": "Radhika Kuthiala",
                            "id": "517470854"
                        }
                ],
                "paging": {
                    "next": "https://nextURL"
                }
            });

            var sendPromise = communicator.send();
            sendPromise.then(function (res) {
                assert.equal(res, data);
               // assert.equal(communicator.nextURL, "https://nextURL");
                complete();
            }, function () { }).done();
            readableStream.emit('data', data);
            readableStream.emit('end');
        });
    });

});