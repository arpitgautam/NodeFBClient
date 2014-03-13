var assert = require("assert"),
sinon = require('sinon'),
Q = require("Q"),
friendsInfoFetcher = require('../src/FriendsInfoFetcher'),
communicatorModule = require('../src/FBGraphAPICommunicator');


describe('FriendTinyInfo', function () {

    var defer, commStub, setPathStub;
    var deferCount = 3;
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
    }

    function _stubCommunicator(defer) {
        var comm = new communicatorModule.FaceBookGraphAPICommunicator;
        var stub = sinon.stub(communicatorModule.FaceBookGraphAPICommunicator.prototype, "send");
        for (var i = 0; i < deferCount; i++) {
            stub.onCall(i).returns(defer[i].promise);
        }

        setPathStub = sinon.stub(comm, "setPath");
        return comm;

    }

    describe('fetching complete friend list', function () {
        it('setting communicator correctly', function (complete) {
            assert.equal(setPathStub.calledWith('/me/friends'), true);
            complete();
        });

        //TODO- Error cases
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
    });
});