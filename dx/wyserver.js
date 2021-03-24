var express = require("express");
var bodyParser = require('body-parser');
var dp = require("C:\\Users\\DELL\\Desktop\\untitled\\dingxiang\\codetest.js");
var en = require("C:\\Users\\DELL\\Desktop\\untitled\\dingxiang\\ua95.js");
// var en = require("C:\\Users\\DELL\\Desktop\\untitled\\dingxiang\\ua.js");
var api = express();
api.use(bodyParser.urlencoded({
    parameterLimit: 50000,
    limit: '50mb',
    extended: false
}));

function randomNum(minNum,maxNum){
    switch(arguments.length){
        case 1:
            return parseInt(Math.random()*minNum+1,10);
            break;
        case 2:
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
            break;
        default:
            return 0;
            break;
    }
}

api.get('/param1', function(req, res){
    var callback = dp.param()[0]();
    console.log("callback: " + callback);
    res.send(callback)
});

api.get('/param2', function(req, res){
    var callback = dp.param()[1]();
    console.log("callback: " + callback);
    res.send(callback)
});

api.post('/en', function(req, res){
    var silde = JSON.parse(req.body.silde)["us"];
    var token = req.body.token;
    var tag = req.body.tag;
    var Pt = en.et;
    var encropy = new Pt({token:token});
    encropy.getMD();
    encropy.getMM("",silde[0]);
    for (var i=0; i<silde.length;){
        i = i + randomNum(20,25);
        if (i > silde.length){
            encropy.getMM("dx_captcha_basic_slider-img-focus_2",silde[silde.length-1]);
        }else {encropy.getMM("dx_captcha_basic_slider-img-focus_2",silde[i]);}
    }
    for (var i=0; i<silde.length; i++){
        encropy.recordSA(silde[i])
    }
    encropy.sendSA();
    encropy.sendTemp(tag);
    var callback = encropy.getUA();
    console.log("callback: " + callback);
    res.send(callback)
});

var server = api.listen(8091, function () {

});