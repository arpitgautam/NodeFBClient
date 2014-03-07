var assert = require("assert");
var sinon = require('sinon');
var Q = require("Q");
var userFetch = require('../src/FBUserFetch');
var communicatorModule = require('../src/FBGraphAPICommunicator');

describe('UserFetch', function() {

	var fetcher = new userFetch.FBUserFetch();
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
		sinon.stub(communicatorModule.FaceBookGraphAPICommunicator.prototype,
				"send").returns(defer.promise);
		return commStub;

	}

	describe('User Fetcher', function() {
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