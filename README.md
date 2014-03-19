# FBClient
A library for making facebook graph API requests easy


## Usage
//token is fb user token
    fb.fbclient.friendInfo(token, function (data) {
        if(fb.fbclient.hasNext()){
            nextCall();
        }

    }, function (e) {
        console.log(e);
    });



    //this is calling nextCall recursive unless no more friends are there
    function nextCall(){
        fb.fbclient.next(token, function (data) {
        if(fb.fbclient.hasNext()){
		    nextCall();
        }

    }, function (e) {
	    console.log(e);
    });
    }


## Developing



### Tools
=======
NodeFBClient
============