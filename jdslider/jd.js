function st(d) {
    var c = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-~".split("")
        , b = c.length
        , e = +d
        , a = [];
    do {
        mod = e % b;
        e = (e - mod) / b;
        a.unshift(c[mod])
    } while (e);return a.join("")
}
function pi(a, b) {
    return (Array(b).join(0) + a).slice(-b)
}
function pm(d, c, b) {
    var f = this;
    var e = st(Math.abs(d));
    var a = "";
    if (!b) {
        a += (d > 0 ? "1" : "0")
    }
    a += pi(e, c);
    return a
}
function gc(sign) {
    var bf = JSON.parse(sign);
    var c = bf["data"];
    var b = new Array();
    for (var e = 0; e < c.length; e++) {
        if (e == 0) {
            b.push(pm(c[e][0] < 262143 ? c[e][0] : 262143, 3, true));
            b.push(pm(c[e][1] < 16777215 ? c[e][1] : 16777215, 4, true));
            b.push(pm(c[e][2] < 4398046511103 ? c[e][2] : 4398046511103, 7, true))
        } else {
            var a = c[e][0] - c[e - 1][0];
            var f = c[e][1] - c[e - 1][1];
            var d = c[e][2] - c[e - 1][2];
            b.push(pm(a < 4095 ? a : 4095, 2, false));
            b.push(pm(f < 4095 ? f : 4095, 2, false));
            b.push(pm(d < 16777215 ? d : 16777215, 4, true))
        }
    }
    return b.join("")
}
module.exports = {
    gc
}
// console.log(gc([
//     [
//         "897",
//         "242",
//         1615772449817
//     ],
//     [
//         "935",
//         "272",
//         1615772449817
//     ],
//     [
//         "938",
//         "272",
//         1615772449920
//     ],
//     [
//         "942",
//         "272",
//         1615772449927
//     ],
//     [
//         "947",
//         "272",
//         1615772449935
//     ],
//     [
//         "954",
//         "272",
//         1615772449944
//     ],
//     [
//         "957",
//         "272",
//         1615772449950
//     ],
//     [
//         "960",
//         "272",
//         1615772449960
//     ],
//     [
//         "964",
//         "272",
//         1615772449967
//     ],
//     [
//         "967",
//         "272",
//         1615772449977
//     ],
//     [
//         "968",
//         "272",
//         1615772449982
//     ],
//     [
//         "971",
//         "272",
//         1615772449992
//     ],
//     [
//         "973",
//         "272",
//         1615772449999
//     ],
//     [
//         "976",
//         "272",
//         1615772450007
//     ],
//     [
//         "979",
//         "272",
//         1615772450014
//     ],
//     [
//         "983",
//         "272",
//         1615772450023
//     ],
//     [
//         "988",
//         "270",
//         1615772450030
//     ],
//     [
//         "991",
//         "270",
//         1615772450039
//     ],
//     [
//         "997",
//         "269",
//         1615772450046
//     ],
//     [
//         "1002",
//         "268",
//         1615772450054
//     ],
//     [
//         "1006",
//         "268",
//         1615772450062
//     ],
//     [
//         "1013",
//         "268",
//         1615772450071
//     ],
//     [
//         "1017",
//         "267",
//         1615772450078
//     ],
//     [
//         "1022",
//         "267",
//         1615772450086
//     ],
//     [
//         "1023",
//         "266",
//         1615772450094
//     ],
//     [
//         "1025",
//         "265",
//         1615772450103
//     ],
//     [
//         "1025",
//         "265",
//         1615772450455
//     ]
// ]))
// "0e1003OnwPyLMp10C10u0000103000001D1040000007105000000810700000091030000006103000000a1040000007103000000a1010000005103000000a10200000071030000008103000000710400000091050020007103000000910600100071050010008104000000810700000091040010007105000000810100100081020010009000000005w"
// "0e1003OnwPyLMp10C10u0000103000001D1040000007105000000810700000091030000006103000000a1040000007103000000a1010000005103000000a10200000071030000008103000000710400000091050020007103000000910600100071050010008104000000810700000091040010007105000000810100100081020010009000000005w"
//
//
// {
//     d: gc([
//         [
//             "897",
//             "242",
//             1615772449817
//         ],
//         [
//             "935",
//             "272",
//             1615772449817
//         ],
//         [
//             "938",
//             "272",
//             1615772449920
//         ],
//         [
//             "942",
//             "272",
//             1615772449927
//         ],
//         [
//             "947",
//             "272",
//             1615772449935
//         ],
//         [
//             "954",
//             "272",
//             1615772449944
//         ],
//         [
//             "957",
//             "272",
//             1615772449950
//         ],
//         [
//             "960",
//             "272",
//             1615772449960
//         ],
//         [
//             "964",
//             "272",
//             1615772449967
//         ],
//         [
//             "967",
//             "272",
//             1615772449977
//         ],
//         [
//             "968",
//             "272",
//             1615772449982
//         ],
//         [
//             "971",
//             "272",
//             1615772449992
//         ],
//         [
//             "973",
//             "272",
//             1615772449999
//         ],
//         [
//             "976",
//             "272",
//             1615772450007
//         ],
//         [
//             "979",
//             "272",
//             1615772450014
//         ],
//         [
//             "983",
//             "272",
//             1615772450023
//         ],
//         [
//             "988",
//             "270",
//             1615772450030
//         ],
//         [
//             "991",
//             "270",
//             1615772450039
//         ],
//         [
//             "997",
//             "269",
//             1615772450046
//         ],
//         [
//             "1002",
//             "268",
//             1615772450054
//         ],
//         [
//             "1006",
//             "268",
//             1615772450062
//         ],
//         [
//             "1013",
//             "268",
//             1615772450071
//         ],
//         [
//             "1017",
//             "267",
//             1615772450078
//         ],
//         [
//             "1022",
//             "267",
//             1615772450086
//         ],
//         [
//             "1023",
//             "266",
//             1615772450094
//         ],
//         [
//             "1025",
//             "265",
//             1615772450103
//         ],
//         [
//             "1025",
//             "265",
//             1615772450455
//         ]
//     ])
//     c: "https://iv.jd.com/slide/g.html?appId=1604ebb2287&scene=login&product=click-bind-suspend&e=4O76IPAS7HLF34FJQA7RRMFPHFJCOIODLAFDETUUEG7VHZSOFREHGGEGHNAFCZSVAO7HQIIJMVQRKVRDFTNX3JYEKI&lang=zh_CN&callback=jsonp_04325189181280453" //返回值中的challenge
//     w: 278 //固定值
//     appId: 1604ebb2287 //固定值
//     scene: login //固定值
//     product: click-bind-suspend //固定值
//     e: 4O76IPAS7HLF34FJQA7RRMFPHFJCOIODLAFDETUUEG7VHZSOFREHGGEGHNAFCZSVAO7HQIIJMVQRKVRDFTNX3JYEKI //固定值
//     s: "https://seq.jd.com/jseqf.html?bizId=passport_jd_com_login_pc&platform=js&version=1" //返回值中提取
//     o: 13653301235 //要登录的手机号
//     lang: zh_CN //固定值
//     callback: jsonp_08135563176540073
// }