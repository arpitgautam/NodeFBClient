# FBClient
A library for making facebook graph API requests easy


## Usage

    var fb = require('./fbclient'),
    log4js  = require('log4js'),
    logModule = require('./lib/logger');

 

    (function initLogger() {
        log4js.loadAppender('file');
        log4js.addAppender(log4js.appenders.file('../logs/cheese.log'), 'fbClient');
        var logger = log4js.getLogger('fbClient');
        logger.setLevel('DEBUG');
        logModule.setLogger(logger);
    })();

    var token = 'INSERT VALID token here';
    fb.fbclient.friendInfo(token, function (data) {
	    //console.log(data);
        //if has next
        if(fb.fbclient.hasNext()){
    	    nextCall();
	    }

    }, function (e) {
        console.log('This is an error');
        console.log(e);
    });


    function nextCall(){
        fb.fbclient.next(token, function (data) {    
       // console.log(data);
        if(fb.fbclient.hasNext()){
		    nextCall();
        }

    }, function (e) {
	    console.log('This is another error');
        console.log(e);
    });
    }

## Developing



### Tools
=======
NodeFBClient
============