genPvid = function() {
    var a = (new Date).getTime();
    var b = "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function(b) {
        var c = (a + 16 * Math.random()) % 16 | 0;
        return a = Math.floor(a / 16),
            ("x" == b ? c : 3 & c | 8).toString(16)
    });
    return b
}

var t = "https://search.jd.com/Search?keyword=%E7%AC%94%E8%AE%B0%E6%9C%AC&enc=utf-8&wq=%E7%AC%94%E8%AE%B0%E6%9C%AC&pvid="+genPvid()
console.log(t)