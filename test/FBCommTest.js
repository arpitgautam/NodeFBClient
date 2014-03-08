//Unit test case for communicator
var assert = require("assert");
var sinon = require('sinon');
var Q = require("Q");
var communicatorModule = require('../src/FBGraphAPICommunicator');

describe('Communicator', function() {

	var dummyToken = "dummy";
	var communicator = new communicatorModule.FaceBookGraphAPICommunicator(
			dummyToken);
	beforeEach(_setup);
	afterEach(_tearDown);

	function _setup() {

	}

	function _tearDown() {

	}

	describe('User Fetcher constructor takes parmas correctly', function() {
		it('should accpet token coreectly', function() {
			assert.equal(communicator.token, dummyToken);
		});

		it('should set path correctly', function() {
			communicator.setPath("path");
			assert.equal(communicator.path, "path");
		});
	});
	
	describe('User Fetcher send shall return correct data',function(){
		it('should call send correctly for success',function(){
			
		});
		
		it('should call send correctly for failures',function(){
			
		});
	});

});