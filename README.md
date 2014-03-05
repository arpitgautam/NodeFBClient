# FBClient
A library for making facebook graph API requests easy


## Usage
	var mod = require('./FBUserFetch');
	
	var token = '';
	
	function success(res) {
		var object = JSON.parse(res.toString());
		console.log(object['name']);
	}
	
	function error(e) {
		console.log(''+e);
	}
	
	
	var api = new mod.FBUserFetch(token);
	api.fetch(success,error);



## Developing



### Tools
=======
NodeFBClient
============