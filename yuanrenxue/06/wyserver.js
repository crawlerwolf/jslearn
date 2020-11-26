var express = require("express");
var bodyParser = require('body-parser');
var mm = require("6.js");
var api = express();
api.use(bodyParser.urlencoded({
    parameterLimit: 50000,
    limit: '50mb',
    extended: false
}));

api.post('/m', function(req, res){
    var t = req.body.t;
    var e = req.body.e;
    var callback = mm.z(t,e);
    console.log("callback: " + callback);
    res.send(callback)
});

var server = api.listen(8091, function () {

});