var mod = require('./FBUserFetch');
var communicatorModule = require('./FBGraphAPICommunicator');

var token = 'CAACEdEose0cBAEf84oZAVlL1CorTmUvesCLutCfSzjSjZAmGZBgg0yZC9agOK7m9bCb6SgTc1zVh1VY6LkeVhrIik0dexbkm2FRpswJwHLZCesnab7sX5829kSjhnTqBUSNZC6rm7VqXIxBqHH7JZA2Wb9RoowD17YpoHExBhZCULTtyptbwBR8CZBabwHZAJgglw0hwbAFU03yQZDZD';

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
