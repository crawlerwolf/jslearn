import requests
import re
import base64

def main():
    url = 'http://match.yuanrenxue.com/match/10'
    response = requests.get(url)
    sessionid = re.findall('(?<=sessionid=).+?(?=;)', response.headers['Set-Cookie'])[0]
    headers = {
        'cookie': 'sessionid=' + sessionid,
        'User-Agent': 'yuanrenxue.project'
    }
    uf = int(re.findall('\d+(?=;var iｉl)', response.text)[0])
    encryptdata = requests.get("http://match.yuanrenxue.com/stati/mu/rsnkw2ksph", headers=headers).text[17:-1]
    decryptdata = base64.b64decode(
        ''.join([chr(ord(encryptdata[i]) - i % uf - 50) for i in range(len(encryptdata))]).encode()).decode()
    data = re.findall("\d+?(?= \+ _yrxCxm)", decryptdata)
    t = requests.get("http://match.yuanrenxue.com/api/offset", headers=headers)
    t1 = t.text[-4:].strip()
    for page in range(1, 6):
        print({"ur": "/api/match/10?page="+str(page), "b1": data[0],"b2": data[1],"b3": data[2], "t1": t1})
        tar_url = requests.post("http://127.0.0.1:8091/url", data={"ur": "/api/match/10?page="+str(page),
                                                                   "b1": data[0],
                                                                   "b2": data[1],
                                                                   "b3": data[2],
                                                                   "t1": t1})
        req = requests.get(tar_url.text, headers=headers)
        print(req.json())
        print(req.json().get("k").get("k").split("|")[-1])
        t1 = req.json().get("k").get("k").split("|")[-1]



main()
