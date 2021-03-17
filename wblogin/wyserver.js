var express = require("express");
var bodyParser = require('body-parser');
var wb = require("weibo.js");
var api = express();
api.use(bodyParser.urlencoded({
    parameterLimit: 50000,
    limit: '50mb',
    extended: false
}));

api.post('/su', function(req, res){
    var user = req.body.su;
    var callback = wb.su(user);
    console.log("callback: " + callback);
    res.send(callback)
});

api.post('/sp', function(req, res){
    var stime = req.body.servertime;
    var nonce = req.body.nonce;
    var pwd = req.body.pwd;
    var callback =  wb.sp(stime,nonce,pwd);
    console.log("callback: " + callback);
    res.send(callback)
});

var server = api.listen(8091, function () {

});