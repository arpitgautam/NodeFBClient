var assert = require("assert");
var sinon = require('sinon');
var userFetch = require('../src/FBUserFetch');
var communicatorModule = require('../src/FaceBookGraphAPICommunicator');

describe('UserFetch', function() {

	var fetcher = new userFetch.FBUserFetch('dummy');

	describe('User Fetcher', function() {
		it('should set token correctly', function() {
			assert.equal(fetcher.token, "dummy");
		});

		it('should call fetch correctly', function() {
			var commStub = sinon.createStubInstance(
					communicatorModule.FaceBookGraphAPICommunicator);
			//pass this stub to UserFetch
		});

	});
});