var communicatorModule = require('./FaceBookGraphAPICommunicator');

function FBUserFetch(token) {
	this.token = token;
}

FBUserFetch.prototype.fetch = function(onSuccess, onError) {
	var communicator = new communicatorModule.FaceBookGraphAPICommunicator(
			"/me", this.token);
	var sendPromise = communicator.send();
	sendPromise.then(onSuccess, onError).done();
};

module.exports.FBUserFetch = FBUserFetch;