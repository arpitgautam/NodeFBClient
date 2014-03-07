
function FBUserFetch() {
	this.setCommunicator = function(comm) {
		this._communicator = comm;
		this._communicator.setPath('/me');
	};
}

FBUserFetch.prototype.fetch = function(onSuccess, onError) {

	var sendPromise = this._communicator.send();
	sendPromise.then(onSuccess, onError).done();
};

module.exports.FBUserFetch = FBUserFetch;