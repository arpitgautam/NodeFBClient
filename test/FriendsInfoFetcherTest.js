var assert = require("assert"),
sinon = require('sinon'),
Q = require("Q"),
friendsInfoFetcher = require('../src/lib/FriendsInfoFetcher'),
communicatorModule = require('../src/lib/FBGraphAPICommunicator');


describe('FriendTinyInfo', function () {

    var defer, commStub, setPathStub, getNextURLStub;
    var deferCount = 6;
    var fetcher = new friendsInfoFetcher.FriendsInfoFetcher();


    beforeEach(_setup);
    afterEach(_tearDown);

    function _setup() {
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

    describe('fetching complete friend list', function () {
        it('setting communicator correctly', function (complete) {
            assert.equal(setPathStub.calledWith('/me/friends'), true);
            complete();
        });

        //TODO- keep this data in files
        it('should fetch friend info', function (complete) {
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
                    "next": "https://nextURL"
                }
            });
            var dataPic1 = JSON.stringify({
                "id": "514749621",
                "picture": {
                    "data": {
                        "url": "pictureURL1",
                        "is_silhouette": false
                    }
                }
            });

            var dataPic2 = JSON.stringify({
                "id": "517470854",
                "picture": {
                    "data": {
                        "url": "pictureURL2",
                        "is_silhouette": false
                    }
                }
            });

            defer[0].resolve(data);
            defer[1].resolve(dataPic1);
            defer[2].resolve(dataPic2);
            fetcher.fetch(function (str) {
                var expected = JSON.stringify({
                    "data": [
                        {
                            "name": "Garima Sharma",
                            "picture": "pictureURL1"
                        },
                        {
                            "name": "Radhika Gabriel",
                            "picture": "pictureURL2"
                        }
                    ]
                });
                assert.equal(str, expected);
                complete();
            });
        });

        it('should fetch friend info next page', function (complete) {
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
                    "next": "https://nextURL"
                }
            });
            var dataPic1 = JSON.stringify({
                "id": "514749621",
                "picture": {
                    "data": {
                        "url": "pictureURL1",
                        "is_silhouette": false
                    }
                }
            });

            var dataPic2 = JSON.stringify({
                "id": "517470854",
                "picture": {
                    "data": {
                        "url": "pictureURL2",
                        "is_silhouette": false
                    }
                }
            });

            defer[0].resolve(data);
            defer[1].resolve(dataPic1);
            defer[2].resolve(dataPic2);
            defer[3].resolve(data);
            defer[4].resolve(dataPic1);
            defer[5].resolve(dataPic2);

            var dummyURL = '/8765432345/friends?limit=767&offset=076&__after_id=9876543234567';
            getNextURLStub.returns(dummyURL);

            fetcher.fetchNext(function (str) {
                var expected = JSON.stringify({
                    "data": [
                        {
                            "name": "Garima Sharma",
                            "picture": "pictureURL1"
                        },
                        {
                            "name": "Radhika Gabriel",
                            "picture": "pictureURL2"
                        }
                    ]
                });
                assert.equal(str, expected);
                assert.equal(setPathStub.calledWith(dummyURL), true);
                fetcher.fetchNext(function (str) {
                    assert.equal(str, expected);
                    complete();
                });

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