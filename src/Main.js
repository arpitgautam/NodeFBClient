var mod = require('./FriendsInfoFetcher'),
communicatorModule = require('./FBGraphAPICommunicator'),
token = '';

function success(res) {
	var object = JSON.parse(res.toString());
    console.log("success@@@@@@@@@")
	console.log(object);
}

function error(e) {
    console.log("error@@@@@@@@@")
	console.log(''+e);
}

var communicator = new communicatorModule.FaceBookGraphAPICommunicator(token);
var api = new mod.FriendsInfoFetcher();
api.setCommunicator(communicator);
api.fetch(success,error);
