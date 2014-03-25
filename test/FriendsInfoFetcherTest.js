var assert = require("assert"),
sinon = require('sinon'),
Q = require("Q"),
fileData = require('./Data'),
friendsInfoFetcher = require('../src/lib/FriendsInfoFetcher'),
communicatorModule = require('../src/lib/FBGraphAPICommunicator');


describe('Friend Information Fetch', function () {

    var defer, commStub, setPathStub, getNextURLStub;
    var deferCount = 6;
    var fetcher = new friendsInfoFetcher.FriendsInfoFetcher();


    beforeEach(_setup);
    afterEach(_tearDown);

    function _setup() {
        fetcher = new friendsInfoFetcher.FriendsInfoFetcher();
        defer = new Array();
        for (var i = 0; i < deferCount; i++) {
            defer[i] = new Q.defer();
        }
        commStub = _stubCommunicator(defer);
        fetcher.setCommunicator(commStub);


    }

    function _tearDown() {
        communicatorModule.FaceBookGraphAPICommunicator.prototype.send.restore();
        commStub.setPath.restore();
        commStub.getNextURL.restore();
    }

    function _stubCommunicator(defer) {
        var comm = new communicatorModule.FaceBookGraphAPICommunicator;
        var stub = sinon.stub(communicatorModule.FaceBookGraphAPICommunicator.prototype, "send");
        for (var i = 0; i < deferCount; i++) {
            stub.onCall(i).returns(defer[i].promise);
        }

        setPathStub = sinon.stub(comm, "setPath");
        getNextURLStub = sinon.stub(comm, "getNextURL");

        return comm;

    }

    describe('should fetch friends ', function () {
        it('while setting communicator correctly', function (complete) {
            assert.equal(setPathStub.calledWith('/me/friends'), true);
            complete();
        });

        it('and fetch friend info', function (complete) {
            var meResponse = fileData.Data.get('meResponse1');
            var friend1Response = fileData.Data.get('friend1Response1');
            var friend2Response = fileData.Data.get('friend2Response1');
            
            defer[0].resolve(meResponse);
            defer[1].resolve(friend1Response);
            defer[2].resolve(friend2Response);
            fetcher.fetch(function (str) {
                var expected = fileData.Data.get('expected1');
                assert.equal(str, expected);
                complete();
            });
        });

        it('and fetch friend info next page', function (complete) {
            var meResponse = fileData.Data.get('meResponse1');
            var friend1Response = fileData.Data.get('friend1Response1');
            var friend2Response = fileData.Data.get('friend2Response1');
           
            defer[0].resolve(meResponse);
            defer[1].resolve(friend1Response);
            defer[2].resolve(friend2Response);

            var dummyURL = '/8765432345/friends?limit=767&offset=076&__after_id=9876543234567';
            getNextURLStub.returns(dummyURL);

            fetcher.fetchNext(function (str) {
                var expected = fileData.Data.get('expected1');
                assert.equal(str, expected);
                assert.equal(setPathStub.calledWith(dummyURL), true);
                complete();


            });
        });
        it('should parse 0 friends correctly', function (complete) {
            var data = fileData.Data.get('nofriendData');
            defer[0].resolve(data);

            fetcher.fetch(function (str) {
                var expected = JSON.stringify({
                    "data": []
                });
                assert.equal(str, expected);
                complete();
            });
        });

        it('should call error function', function (complete) {
            var data = JSON.stringify({
                "error": {
                    "message": "An active access token must be used to query information about the current user.", "type": "OAuthException", "code": 2500
                }
            });
            defer[0].reject(data);
            fetcher.fetch(function (str) { }, function (e) {
                assert.equal(e, data);
                complete();
            });

        });
    });
});