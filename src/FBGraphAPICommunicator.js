var https = require('https'),
Q = require('q');


// This class converts chunk data into 1 concrete response
// as fb data is paginated, we are not risking out of mem errors
// making response whole makes client implementation easier
// ///////////////////////////////////////////////Request/////////////////////////////////////
var self;
function FaceBookGraphAPICommunicator(token) {
	
	///shared
	this.token = token;
	this.nextURL;
	
	//privates
	var data = "";
	var _deferred = null;
	var path = null;
	self = this;
	this.setPath = function(p){
		path = p;
	}
	this.getPath = function(){
		return path;
	}
	this.setDefer = function(d){
		_deferred = d;
	}
	this.getDefer = function(){
		return _deferred;
	}
	this.appendData = function(d){
		data += d;
	}
	this.getData = function(){
		return data;
	}
	return this;
}


FaceBookGraphAPICommunicator.prototype.send = function () {
    var options = {
        host: 'graph.facebook.com',
        path: this.getPath(),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + self.token
        }
    };

    this.setDefer(Q.defer());
    var that = this;
    var req = https.request(options, function (res) {
        // check for error codes here
        that._responseHandler(res);
    });
    req.on('error', function (e) {
        that.getDefer().reject(e);
    });
    req.end();
    return this.getDefer().promise;
};


FaceBookGraphAPICommunicator.prototype._parseDataForNext = function () {
    var dataObject = JSON.parse(this.getData());
    if (dataObject.paging && dataObject.paging.next) {
    	self.nextURL = dataObject.paging.next;
    	
    } else {
        self.nextURL = "";
    }
};

FaceBookGraphAPICommunicator.prototype._responseHandler = function (res) {
    var that = this;
    res.on('data', function (data) {
        that.appendData(data);
        res.read();
    });
    res.on('end', function () {
        var responseObject = JSON.parse(that.getData());
        if (responseObject.error) {
            that.getDefer().reject(JSON.stringify(responseObject.error));
        } else {

            that.getDefer().resolve(that.getData());
        }
        self._parseDataForNext();

    });
};

// /////////////////////////////////////////////////////////////////////////////////////////////
module.exports.FaceBookGraphAPICommunicator = FaceBookGraphAPICommunicator;