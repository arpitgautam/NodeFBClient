var util = require('util'),
Q = require('Q'),
communicatorModule = require('./FBGraphAPICommunicator'),
userFetch = require('./UserFetch'),
logger = require('./logger');

//Caution - this class is unsafe for creating multiple objects in same context
//do not attempt it
var counter = 0;
function FriendsInfoFetcher(){
    self = this;
    this.nameMap = {};
    result = {"data": []};
    this.getResult = function () {
        return result;
    }
};

util.inherits(FriendsInfoFetcher, userFetch.UserFetch);

FriendsInfoFetcher.prototype.setCommunicator = function (comm) {
    this._communicator = comm;
    this._communicator.setPath('/me/friends');
}

FriendsInfoFetcher.prototype.fetch = function (onSuccess, onError) {

    var sendPromise = this._communicator.send();
    logger.log('trace', 'fetching friends for active user');
    sendPromise.then(this._sendIndividualRequests.bind(this)).then(this._aggregateResponse.bind(this)).
						then(onSuccess, onError).done();

};

FriendsInfoFetcher.prototype.fetchNext = function (onSuccess, onError) {
    this._communicator.setPath(this._communicator.getNextURL());
    var sendPromise = this._communicator.send();
    logger.log('trace', 'fetching next friends for active user');
    logger.log('debug', 'sending request for:' + this._communicator.getNextURL());
    sendPromise.then(this._sendIndividualRequests.bind(this)).then(this._aggregateResponse.bind(this)).
                        then(onSuccess, onError).done();

};

FriendsInfoFetcher.prototype._sendIndividualRequests = function (data) {
    var promises = new Array();
    logger.log('debug', 'recieved data for friend list:' + data);
     logger.log('trace', 'in send individual requests');
    var dataObject = JSON.parse(data);
    logger.log('trace', 'fetching individual friends for active user');
    for (var i in dataObject.data) {
        //TODO- make this tick
        var comm = new communicatorModule.FaceBookGraphAPICommunicator(this._communicator.getToken());
        var id = dataObject.data[i].id;
        var name = dataObject.data[i].name;
        var path = '/' + id + '?fields=picture';
        comm.setPath(path);
        logger.log('debug', 'sending request to:' + path);
        self.nameMap[id] = name;
        promises[i] = comm.send();
        promises[i].then(this._createResponse.bind(this));
    }
    return Q.allSettled(promises);
}

//result.data is getting updated here
// do not try to attempt modify it in a different function
FriendsInfoFetcher.prototype._createResponse = function (data) {
    logger.log('trace', 'in create response');
    logger.log('debug', 'concating individual response');
    logger.log('debug', 'data:' + data);
    var dataObject = JSON.parse(data);
    var name = this.nameMap[dataObject.id]
    var pictureURL = dataObject.picture.data.url;
    this.getResult().data.push({
        "name": name,
        "picture": pictureURL,
        "id": dataObject.id
    });
    counter = counter + 1;
}

FriendsInfoFetcher.prototype._aggregateResponse = function (data) {
    logger.log('trace','in aggreate Response');
    if (this.getResult() == null) {
        logger.log('error', 'result aggregated by friend fetcher is null');
        throw "No data to return";
    }
    var stringResponse = JSON.stringify(this.getResult())
    logger.log('debug', 'concatenated response' + stringResponse);
    return stringResponse;
}

module.exports.FriendsInfoFetcher = FriendsInfoFetcher;