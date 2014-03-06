var assert = require("assert");
var sinon = require('sinon');
var Q = require("Q");
var userFetch = require('../src/FBUserFetch');
var communicatorModule = require('../src/FaceBookGraphAPICommunicator');

describe('UserFetch', function() {

	var fetcher = new userFetch.FBUserFetch('dummy');

	describe('User Fetcher', function() {
		it('should set token correctly', function() {
			assert.equal(fetcher.token, "dummy");
		});

		it('should call fetch correctly on sucess', function() {
			var defer = Q.defer;
			sinon.stub(
					communicatorModule.FaceBookGraphAPICommunicator.prototype,
					"send").returns(defer.resolve);
			
			// pass this stub to UserFetch
			//call fetch method
			//verify it calls onSuccess and OnError
			defer.resolve;
		});

	});
});