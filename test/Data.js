var fs = require('fs');

var dataFilePaylod;

dataFilePaylod = fs.readFileSync('test/data/testData.json','utf8');

exports.Data = {
    get: function (name) {
        var json = JSON.parse(dataFilePaylod);
        return JSON.stringify(json[name]);        
    }
}