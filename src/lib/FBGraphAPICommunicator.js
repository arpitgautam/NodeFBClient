var https = require('https'),
Q = require('q');


// This class converts chunk data into 1 concrete response
// as fb data is paginated, we are not risking out of mem errors
// making response whole makes client implementation easier
// ///////////////////////////////////////////////Request/////////////////////////////////////
function FaceBookGraphAPICommunicator(token) {
	
	///shared
	var token = token;
	var nextURL;
	
	//privates
	var data = "";
	var _deferred = null;
	var path = null;
	
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
	this.setToken = function (t) {
	    token = t;
	}
	this.getToken = function () {
	    return token;
	}
	this.setNextURL = function (url) {
	    nextURL = url;
	}
	this.getNextURL = function () {
	    return nextURL;
	}
	return this;
}


FaceBookGraphAPICommunicator.prototype.send = function () {
    var options = {
        host: 'graph.facebook.com',
        path: this.getPath(),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.getToken()
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
        this.setNextURL(dataObject.paging.next);

    } else {
        this.setNextURL("");
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
            that._parseDataForNext();
        }

    });
};

// /////////////////////////////////////////////////////////////////////////////////////////////
module.exports.FaceBookGraphAPICommunicator = FaceBookGraphAPICommunicator;