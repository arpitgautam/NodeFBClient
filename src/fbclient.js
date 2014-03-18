//all calls must be route through this interface
//this is exposed through npm package
var mod = require('./lib/FriendsInfoFetcher'),
communicatorModule = require('./lib/FBGraphAPICommunicator');

exports.fbclient = {
    friendInfo: function (token,s, e) {
        var communicator = new communicatorModule.FaceBookGraphAPICommunicator(token);
        var api = new mod.FriendsInfoFetcher();
        api.setCommunicator(communicator);
        api.fetch(s,e);
    }
};