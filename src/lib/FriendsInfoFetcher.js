var util = require('util'),
Q = require('Q'),
communicatorModule = require('./FBGraphAPICommunicator'),
userFetch = require('./UserFetch'),
logger = require('./logger');

//Caution - this class is unsafe for creating multiple objects in same context
//do not attempt it
function FriendsInfoFetcher(){
    self = this;
    this.nameMap = {};
};

util.inherits(FriendsInfoFetcher, userFetch.UserFetch);

FriendsInfoFetcher.prototype.setCommunicator = function (comm) {
    this._communicator = comm;
    this._communicator.setPath('/me/friends');
}

FriendsInfoFetcher.prototype.fetch = function (onSuccess, onError) {

    var sendPromise = this._communicator.send();
    logger.log('debug', 'fetching friends for active user');
    sendPromise.then(this._sendIndividualRequests.bind(this)).then(this._createResponse.bind(this)).
						then(onSuccess, onError).done();

};
FriendsInfoFetcher.prototype.fetchNext = function (onSuccess, onError) {
    this._communicator.setPath(this._communicator.getNextURL());
    var sendPromise = this._communicator.send();
    logger.log('debug', 'fetching next friends for active user');
    sendPromise.then(this._sendIndividualRequests.bind(this)).then(this._createResponse.bind(this)).
						then(onSuccess, onError).done();

};

FriendsInfoFetcher.prototype._sendIndividualRequests = function (data) {
	var promises = new Array();
    logger.log('debug', 'recieved data for friend list:' + data);
        
    var dataObject = JSON.parse(data);
    logger.log('debug', 'fetching friends for active user');
    for (var i  in dataObject.data) {
    	var comm = new communicatorModule.FaceBookGraphAPICommunicator(this._communicator.getToken());
    	var id = dataObject.data[i].id;
        var name = dataObject.data[i].name;
        var path = '/' + id + '?fields=picture';
        comm.setPath(path);
        logger.log('debug', 'sending request to:' + path);
        self.nameMap[id] = name;
        promises[i] =  comm.send();
    }
    return Q.allSettled(promises);
}

FriendsInfoFetcher.prototype._createResponse = function (data) {

    var result = {"data": []};
    logger.log('debug', 'concating responses');
   
    //this loop can take a lot of time,
    // need refactoring
    for (var i in data) {
        var response = data[i].value;
        logger.log('debug', 'data:' + response);
        var dataObject = JSON.parse(response);
        var name = this.nameMap[dataObject.id]
        var pictureURL = dataObject.picture.data.url;
        result.data.push({
            "name": name,
            "picture": pictureURL,
            "id" : dataObject.id
        });

    }
    return JSON.stringify(result);
}

module.exports.FriendsInfoFetcher = FriendsInfoFetcher;