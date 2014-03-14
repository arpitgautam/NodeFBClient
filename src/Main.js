var mod = require('./FriendsInfoFetcher'),
communicatorModule = require('./FBGraphAPICommunicator'),
token = 'CAACEdEose0cBAPjyZA7ZCVD2IhGaQ21igAOZAmLqL0T1HNndupZAzn3WpOr1fZBxpJZA3oZAXIEEH574dTZBtlrpt3kfeoPf1sHI1EgR2q9ULK7jOi7j3aLUzAhfuNixocFHNCv1FGN7ZAJdzwOOAmE7pAJA94v8hOdDIHZBhAy1Aw2zBmSZCaal0pHqRXV5LcDI7wAMOgoXZApdZCAZDZD';

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
