//all calls must be route through this interface
//this is exposed through npm package
var mod = require('./lib/FriendsInfoFetcher'),
communicatorModule = require('./lib/FBGraphAPICommunicator');

exports.fbclient = {
    _comm: null,
    friendInfo: function (token, s, e) {
        _comm = new communicatorModule.FaceBookGraphAPICommunicator(token);
        var api = new mod.FriendsInfoFetcher();
        api.setCommunicator(_comm);
        api.fetch(s, e);
    },
    hasNext:function(){
        if(_comm){
            if(_comm.getNextURL()){
                return true;
            }
        }
        return false;
    },
    next: function (token, s, e) {
        var api = new mod.FriendsInfoFetcher();
        if (!_comm) {
            e('Need to call friendInfo first');
        }
        api.setCommunicator(_comm);
        api.fetchNext(s, e);
    }
};