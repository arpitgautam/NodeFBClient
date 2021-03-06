var assert = require("assert"),
sinon = require('sinon'),
Q = require("Q"),
userFetch = require('../src/lib/UserFetch'),
communicatorModule = require('../src/lib/FBGraphAPICommunicator');

describe('UserFetch', function() {

	var fetcher = new userFetch.UserFetch();
	var defer;
	var commStub;

	beforeEach(_setup);
	afterEach(_tearDown);

	function _setup() {
		defer = Q.defer();
		commStub = _stubCommunicator(defer);
		fetcher.setCommunicator(commStub);
	}
	function _tearDown() {
		commStub.send.restore();
	}

	function _stubCommunicator(defer) {
		var commStub = new communicatorModule.FaceBookGraphAPICommunicator;
		sinon.stub(commStub,"send").returns(defer.promise);
		return commStub;

	}

	describe('test for fetch()', function() {
		it('should call fetch correctly on sucess', function(done) {
			defer.resolve("Dummy");
			fetcher.fetch(function(str) {
				done();
			});
		});

		it('should call fetch correctly on error', function(done) {
			defer.reject();
			fetcher.fetch(function(str) {
			
			}, function() {
				done();
			});
		});

	});
});