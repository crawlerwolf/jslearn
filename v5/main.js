const fs = require("fs");
const esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require('escodegen');
const iconv = require('iconv-lite');
const escope = require('escope');

// 添加编写的插件
const testv5gaoji = require("./testv5gaoji.js");

// 读入源码
var content = fs.readFileSync('./source.js', {encoding: 'binary'});
var buf = new Buffer.from(content, 'binary');
var code = iconv.decode(buf, 'utf-8');
// 将源代码解析成AST
var ast = esprima.parse(code);
// 对源代码进行还原
ast = testv5gaoji.Fix0(ast);
ast = testv5gaoji.Fix(ast);
ast = testv5gaoji.Fix1(ast);
ast = testv5gaoji.Fix3(ast);
ast = testv5gaoji.Fix4(ast);

ast = testv5gaoji.Fix0(ast);
ast = testv5gaoji.Fix(ast);
ast = testv5gaoji.Fix1(ast);
ast = testv5gaoji.Fix2(ast);
ast = testv5gaoji.Fix3(ast);
ast = testv5gaoji.Fix4(ast);
ast = testv5gaoji.Fix5(ast);

code = escodegen.generate(ast);
fs.writeFile('output.js', code, {flag: 'w', encoding: 'utf-8', mode: '0666'}, function (err) {
    if (err) {
        console.log("文件写入失败")
    } else {
        console.log("文件写入成功");
    }
});