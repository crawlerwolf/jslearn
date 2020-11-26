var express = require("express");
var bodyParser = require('body-parser');
var mm = require("10.js");
var api = express();
api.use(bodyParser.urlencoded({
    parameterLimit: 50000,
    limit: '50mb',
    extended: false
}));

api.post('/url', function(req, res){
    var ur = req.body.ur;
    var b1 = req.body.b1;
    var b2 = req.body.b2;
    var b3 = req.body.b3;
    var t1 = req.body.t1;
    var callback = mm._url(ur,b1,b2,b3,t1);
    console.log("callback: " + callback);
    res.send(callback)
});

var server = api.listen(8091, function () {

});