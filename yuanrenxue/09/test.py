# -*- coding: utf-8 -*-
import re

import requests


headers = {
    'User-Agent': 'yuanrenxue.project'
}
get_m = requests.get("http://match.yuanrenxue.com/match/9", headers=headers)
pattern = re.compile('.*?<script type="application/javascript">(.*?)</script>.*?', re.S)
text = re.search(pattern, get_m.text)
m = requests.post("http://127.0.0.1:8091/Cookie", data={"tt": text.group(1).replace("global", 'yeyue')})
headers.update({
'cookie': 'sessionid='+requests.utils.dict_from_cookiejar(get_m.cookies).get("sessionid")+'; '+m.text
})
tt1 = requests.get("http://match.yuanrenxue.com/match/9", headers=headers)

for num in range(1, 6):
    req = requests.get("http://match.yuanrenxue.com/api/match/9?page={0}".format(num), headers=headers)
    print(req.url)
    print(req.status_code)
    print(req.json())

