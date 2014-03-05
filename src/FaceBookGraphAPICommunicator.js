var https = require('https');
var Q = require('q');


//This class converts chunk data into 1 concrete response
//as fb data is paginated, we are not risking out of mem errors
//making response whole makes client implementation easier
/////////////////////////////////////////////////Request/////////////////////////////////////
function FaceBookGraphAPICommunicator(path, token) {
	this.path = path;
	this.token = token;
	this.data = "";
	this._deferred = null;
}

FaceBookGraphAPICommunicator.prototype.send = function() {
	var options = {
		host : 'graph.facebook.com',
		path : this.path,
		headers : {
			'Content-Type' : 'application/json',
			'Authorization' : 'Bearer ' + this.token
		}
	};
	this._deferred = Q.defer();
	var that = this;
	var req = https.request(options, function(res){
	//check for error codes here
		that._responseHandler(res);
	});
	req.on('error', function(e){
		that._deferred.reject(e);
	});
	req.end();
	return this._deferred.promise;
};

FaceBookGraphAPICommunicator.prototype._responseHandler = function(res){
	var that = this;
	res.on('data',function(data){
		that.data += data;
		res.read();
	});
	res.on('end',function(){
		that._deferred.resolve(that.data);
	});
};

///////////////////////////////////////////////////////////////////////////////////////////////
module.exports.FaceBookGraphAPICommunicator = FaceBookGraphAPICommunicator;