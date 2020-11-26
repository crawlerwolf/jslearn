var express = require("express");
var bodyParser = require('body-parser');
var mm = require("9.js");
var api = express();
api.use(bodyParser.urlencoded({
    parameterLimit: 50000,
    limit: '50mb',
    extended: false
}));

api.post('/Cookie', function(req, res){
    var tt = req.body.tt;
    var callback = mm.mm(tt);
    console.log("callback: " + callback);
    res.send(callback)
});

var server = api.listen(8091, function () {

});