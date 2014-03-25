var logger;


exports.setLogger = function(l){
	logger = l;
}
exports.log = function (level, msg) {
    if (logger) {
        logger.log(level, msg)
    }
}
