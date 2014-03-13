var util = require('util'),
Q = require('Q'),
communicatorModule = require('./FBGraphAPICommunicator'),
userFetch = require('./UserFetch');


var self;
function FriendsInfoFetcher(){
    self = this;
    this.nameMap = {};
};

util.inherits(FriendsInfoFetcher, userFetch.UserFetch);

var parentFetch = userFetch.UserFetch.prototype.fetch;

FriendsInfoFetcher.prototype.setCommunicator = function (comm) {
    this._communicator = comm;
    this._communicator.setPath('/me/friends');
}

FriendsInfoFetcher.prototype.fetch = function(onSuccess, onError) {

	var sendPromise = this._communicator.send();
	sendPromise.then(this._sendIndividualRequests, onError).then(this._createResponse,onError).then(onSuccess,onError).done();
	//sendPromise.then(this._sendIndividualRequests, onError).then(onSuccess,onError).done();
	
};



FriendsInfoFetcher.prototype._sendIndividualRequests = function (data) {
    var promises = new Array();
    var dataObject = JSON.parse(data);
    for (var i  in dataObject.data) {
    	var comm = new communicatorModule.FaceBookGraphAPICommunicator(self._communicator.token);
    	var id = dataObject.data[i].id;
        var name = dataObject.data[i].name;
        comm.setPath('/' + id + '?fields=picture');
        self.nameMap[id] = name;
        promises[i] =  comm.send();
    }
    return Q.allSettled(promises);
}

FriendsInfoFetcher.prototype._createResponse = function (data) {

    var result = {"data": []};
    for (var i in data) {
        var response = data[i].value;
        var dataObject = JSON.parse(response);
        var name = self.nameMap[dataObject.id]
        console.log( dataObject.picture.data.url)
        var pictureURL = dataObject.picture.data.url;
        result.data.push({
            "name": name,
            "picture": pictureURL
        });

    }
    return JSON.stringify(result);
}

module.exports.FriendsInfoFetcher = FriendsInfoFetcher;