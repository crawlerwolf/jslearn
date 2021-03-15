var express = require("express");
var bodyParser = require('body-parser');
var jd = require("jd.js");
var api = express();
api.use(bodyParser.urlencoded({
    parameterLimit: 50000,
    limit: '50mb',
    extended: false
}));

api.post('/d', function(req, res){
    var sign = req.body.token;
    var callback = jd.gc(sign);
    console.log("callback: " + callback);
    res.send(callback)
});

var server = api.listen(8091, function () {

});