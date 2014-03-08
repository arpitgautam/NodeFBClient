var mod = require('./FBUserFetch'),
communicatorModule = require('./FBGraphAPICommunicator'),
token = '';

function success(res) {
	var object = JSON.parse(res.toString());
	console.log(object);
}

function error(e) {
	console.log(''+e);
}

var communicator = new communicatorModule.FaceBookGraphAPICommunicator(token);
var api = new mod.FBUserFetch();
api.setCommunicator(communicator);
api.fetch(success,error);
