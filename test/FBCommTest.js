//Unit test case for communicator
var assert = require("assert"),
sinon = require('sinon'),
Q = require("Q"),
https = require('https'),
Readable = require('stream').Readable,
Writable = require('stream').Writable,
communicatorModule = require('../src/lib/FBGraphAPICommunicator');


describe('Communicator', function () {

    var dummyToken = "dummy";
    var writableStream;
    var communicator;
    //need real implementation of Readable stream so that events work and can be tested
    var readableStream;

    beforeEach(_setup);
    afterEach(_tearDown);

    function _setup() {
        communicator = new communicatorModule.FaceBookGraphAPICommunicator(
			dummyToken);
        writableStream = new Writable;
        readableStream = new Readable;
        readableStream._read = function (n) { };

        var httpReqStub = sinon.stub(https, 'request');
        httpReqStub.returns(writableStream);
        httpReqStub.yields(readableStream);
    }

    function _tearDown() {
        https.request.restore();
    }

    describe('Parameters', function () {
        it('should accpet token coreectly', function () {
            assert.equal(communicator.getToken(), dummyToken);
        });

        it('should set path correctly', function () {
            communicator.setPath("path");
            assert.equal(communicator.getPath(), "path");
        });
    });

    describe('sending data', function () {
        it('should call send() correctly', function (complete) {
            var sendPromise = communicator.send();
            sendPromise.then(function () {
                assert.equal(communicator.getData(), '123456');
                complete()
            }).done();
            readableStream.emit('data', '123');
            readableStream.emit('data', '456');
            readableStream.emit('end');
        });

        it('should call send() correctly for failures2', function (completed) {
            var sendPromise = communicator.send();
            sendPromise.then(function () { }, function (e) {
                assert.equal(e, 'Network Timeout');
                completed();
            }).done();
            writableStream.emit('error', 'Network Timeout');
        });

        it('should handle facebook errors', function (completed) {
            var data = JSON.stringify({
                "error": {
                    "message": "An active access token must be used to query information about the current user.", "type": "OAuthException", "code": 2500
                }
            });

            var sendPromise = communicator.send();
            sendPromise.then(function () { }, function (e) {
                assert.deepEqual(e, JSON.stringify(JSON.parse(data).error));
                completed();
            }).done();
            readableStream.emit('data', data);
            readableStream.emit('end');
        });
    });

    describe('parsing friend data', function () {
        it('should parse success correctly for next url', function (complete) {
            var data = JSON.stringify(
            {
                "data": [
                        {
                            "name": "Garima Sharma",
                            "id": "514749621"
                        },
                        {
                            "name": "Radhika Gabriel",
                            "id": "517470854"
                        }
                ],
                "paging": {
                    "next": "https://graph.facebook.com/8765432345/friends?limit=767&offset=076&__after_id=9876543234567"
                }
            });
            verifyURL(complete, data, "/8765432345/friends?limit=767&offset=076&__after_id=9876543234567")

        });

        it('should parse correctly for next invalid url', function (complete) {
            var data = JSON.stringify(
            {
                "data": [
                        {
                            "name": "Garima Sharma",
                            "id": "514749621"
                        },
                        {
                            "name": "Radhika Gabriel",
                            "id": "517470854"
                        }
                ],
                "paging": {
                    "next": "https://myurl/8765432345/friends?limit=767&offset=076&__after_id=9876543234567"
                }
            });
            verifyURL(complete, data, "");

        });

        it('should handle absence of paging tag in friends response', function (complete) {
            var data = JSON.stringify(
            {
                "data": [
                        {
                            "name": "Garima Sharma",
                            "id": "514749621"
                        }
                ]
            });
            verifyURL(complete, data, "")
        });

        it('should handle absence of next tag', function (complete) {
            var data = JSON.stringify(
            {
                "data": [
                        {
                            "name": "Garima Sharma",
                            "id": "514749621"
                        }
                ],
                "paging": {
                }
            });
            verifyURL(complete, data, "")
        });

        it('should handle empty url in next tag in friends response', function (complete) {
            var data = JSON.stringify(
            {
                "data": [
                        {
                            "name": "Garima Sharma",
                            "id": "514749621"
                        },
                        {
                            "name": "Radhika Gabriel",
                            "id": "517470854"
                        }
                ],
                "paging": {
                    "next": ""
                }
            });
            verifyURL(complete, data, "");
        });
        it('should handle no friends case', function (complete) {
            var data = JSON.stringify({
              "data": [
              ], 
              "paging": {
                "previous": "https://graph.facebook.com/530625036/friends?limit=5000&offset=0"
              }
            });
            verifyURL(complete, data, "");
        })

        function verifyURL(complete, data, url) {
            var sendPromise = communicator.send();
            sendPromise.then(function (res) {
                assert.equal(res, data);
                assert.equal(communicator.getNextURL(), url);
                complete();
            }, function () { }).done();
            readableStream.emit('data', data);
            readableStream.emit('end');
        }
    });
});