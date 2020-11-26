# -*- coding: utf-8 -*-
import time

import requests
headers = {
"User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36"
}
q = ""
e= 1
for num in range(1, 6):
    if num == 1:
        print(num)
        t = int(time.time())*1000
        q += str(e) + '-' + str(t) + '|'
        req1 = requests.post("http://127.0.0.1:8091/m",data={"t":t,"e":e})
        req = requests.get("http://match.yuanrenxue.com/api/match/6?", headers=headers, params={"m":req1.text, "q": q})
        print(req.json())
        e += 1
    else:
        print(num)
        t = int(time.time()) * 1000
        q += str(e) + '-' + str(t) + '|'
        req1 = requests.post("http://127.0.0.1:8091/m",data={"t":t,"e":e})
        req = requests.get("http://match.yuanrenxue.com/api/match/6?", headers=headers, params={"page":num,"m":req1.text, "q": q})
        print(req.json())
        e += 1
