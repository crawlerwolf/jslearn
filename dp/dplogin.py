# -*- coding: utf-8 -*-
import base64
import json
import time

import requests

session = requests.session()



def get_slide_code():
    headers = {
        'Accept': 'text/html, */*; q=0.01',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Cache-Control': 'no-cache',
        'Content-Length': '55',
        'Content-type': 'application/x-www-form-urlencoded',
        'Host': 'account.dianping.com',
        'Origin': 'https://account.dianping.com',
        'Pragma': 'no-cache',
        'Referer': 'https://account.dianping.com/account/iframeLogin?callback=EasyLogin_frame_callback0&wide=false&protocol=https:&redir=http%3A%2F%2Fwww.dianping.com%2Fshop%2Fl7rXMA3zpOtCByZW',
        'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36'
    }
    url = "https://account.dianping.com/ajax/json/account/slideBlockAuth"
    data = {'captchaSource': 2,
            'countryCode': 86,
            'mobile': 13612345678,
            'dpid': ""}
    req = session.post(url, headers=headers, data=data)
    print(req.json())
    return req.json().get("requestCode")


def get_page_data(requestCode):
    headers = {
        'Accept': 'text/html, */*; q=0.01',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Cache-Control': 'no-cache',
        'Content-Length': '69',
        'Content-type': 'application/x-www-form-urlencoded',
        'Host': 'verify.meituan.com',
        'Origin': 'https://account.dianping.com',
        'Pragma': 'no-cache',
        'Referer': 'https://account.dianping.com/',
        'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36'
    }
    url = "https://verify.meituan.com/v2/ext_api/page_data"
    data = {'requestCode': requestCode,
            'feVersion': '1.4.1',
            'source': 1}
    req = session.post(url, headers=headers, data=data)
    print(req.json())
    return req.json()


def get_encropy():
    requestCode = get_slide_code()
    req_data = get_page_data(requestCode)["data"]
    sign = req_data["sign"]
    session1 = req_data["session"]
    uid = requests.post("http://127.0.0.1:8091/uid", data={"session": session1.replace("=", ""), "sign": sign})
    print(uid.text)
    c = base64.b64encode(uid.text.encode("utf8")).decode("utf8")
    print(c)
    tt = int(time.time() * 1000)
    slide1 = '{"trajectory":[{"point":[[0,44,185,2486],[0,51,185,2628],[0,63,185,2636],[0,77,185,2645],[0,97,185,2653],[0,127,185,2661],[0,163,185,2668],[0,198,185,2677],[0,233,185,2685],[0,263,185,2693]]}],"env":{"zone":[230,33],"client":[29,168],"Timestamp":[1614933830271,1614933832757],"count":1,"timeout":0}}'
    parse_slide1 = json.loads(slide1)
    add_tt = parse_slide1["env"].get("Timestamp")[-1]
    parse_slide1["env"]["Timestamp"] = [i - add_tt + tt for i in parse_slide1["env"].get("Timestamp")]
    slide_requestCode = base64.b64encode(requestCode.encode("utf8")).decode("utf8").replace("=", ")").replace("+",                                                                                                ")")
    print(slide_requestCode)

    n = requests.post("http://127.0.0.1:8091/en", data={"ur": json.dumps(parse_slide1), "b1": slide_requestCode})
    # n = "Kaito"(slide1, slide_requestCode)
    # print(n.text)
    print("*"*20)
    behavior = c + '#' + requests.post("http://127.0.0.1:8091/en", data={"ur": n.text,"b1": c}).text
    print(behavior)
    print("*" * 20)
    slide2 = '{"v":"2.2.1","ts":1614933370285,"cts":1614933856675,"brVD":[290,346],"brR":[[1920,1080],[1920,1040],24,24],"bI":["https://account.dianping.com/account/iframeLogin?callback=EasyLogin_frame_callback0&wide=false&protocol=https:&redir=http%3A%2F%2Fwww.dianping.com%2Fshop%2Fl7rXMA3zpOtCByZW##","https://account.dianping.com/login?redir=http%3A%2F%2Fwww.dianping.com%2Fshop%2Fl7rXMA3zpOtCByZW"],"aM":"","broP":["Chrome PDF Plugin","Chrome PDF Viewer","Native Client"],"cV":"750b4d80c1e23d008484f480ef2d1ac2","wV":"WebKit","wR":"WebKit WebGL","wVU":"Google Inc.","wRU":"ANGLE (Intel(R) HD Graphics 630 Direct3D11 vs_5_0 ps_5_0)","aF":"","wI":45643245,"fL":"101e71f73daca874711e02ddf38a792f","mT":["263.000,185.000,462678","233.000,185.000,462671","198.000,185.000,462663","163.000,185.000,462654","127.000,185.000,462647","97.000,185.000,462639","77.000,185.000,462631","63.000,185.000,462622","51.000,185.000,462614","47.000,185.000,462606","45.000,185.000,462598","44.000,185.000,462190","44.000,184.000,462182","42.000,184.000,462166","40.000,183.000,462158","38.000,182.000,462150","37.000,181.000,462142","35.000,181.000,462134","34.000,181.000,461934","33.000,181.000,461926","32.000,180.000,461918","31.000,179.000,461910","28.000,179.000,461902","22.000,176.000,461894","15.000,173.000,461886","6.000,172.000,461878","8.000,176.000,461614","18.000,180.000,461606","29.000,182.000,461598","43.000,185.000,461590","54.000,190.000,461582","66.000,193.000,461574","78.000,197.000,461566","94.000,201.000,461558","106.000,205.000,461550","128.000,212.000,461542","148.000,219.000,461534","164.000,224.000,461526","191.000,237.000,461518","216.000,247.000,461510","244.000,258.000,461502","275.000,270.000,461494","82.000,237.000,456222","82.000,237.000,453910","81.000,237.000,453894","79.000,237.000,453886","77.000,237.000,453878","74.000,237.000,453870","72.000,237.000,453862","69.000,237.000,453854","66.000,237.000,453846","62.000,237.000,453838","59.000,237.000,453830","54.000,237.000,453822","48.000,237.000,453814","42.000,237.000,453806","36.000,237.000,453798","31.000,237.000,453790","25.000,237.000,453782","19.000,237.000,453774"],"kT":[],"aT":["82.000,237.000,BUTTON,459599","24.000,195.000,DIV,275070","74.000,247.000,BUTTON,272159","-169.000,111.000,HTML,269030","122.000,248.000,BUTTON,7567"],"tT":[],"dT":["44.000,185.000,DIV,462472","82.000,237.000,BUTTON,456201","53.000,191.000,DIV,277335","41.000,196.000,DIV,273407","74.000,247.000,BUTTON,266615","47.000,190.000,DIV,9976","122.000,248.000,BUTTON,1176"],"sT":[],"inputs":[],"buttons":[{"buttonName":"login-button-account","touchPoint":"{82,237}","touchPosition":"{24.7,67.6}","touchTimeStamp":1614933829884}]}'
    parse_slide2 = json.loads(slide2)
    parse_slide2["ts"] = parse_slide2["ts"] - add_tt + tt
    parse_slide2["cts"] = parse_slide2["cts"] - add_tt + tt
    parse_slide2["buttons"][0]["touchTimeStamp"] = parse_slide2["buttons"][0]["touchTimeStamp"] + - add_tt + tt
    t = requests.post("http://127.0.0.1:8091/en", data={"ur": json.dumps(parse_slide2), "b1": slide_requestCode})
    print(t.text)
    print("*" * 20)
    _token = c + '#' + requests.post("http://127.0.0.1:8091/en", data={"ur": t.text, "b1": c}).text
    print(_token)

    headers = {
        'Accept': 'text/html, */*; q=0.01',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Cache-Control': 'no-cache',
        'Content-Length': '55',
        'Content-type': 'application/x-www-form-urlencoded',
        'Host': 'verify.meituan.com',
        'Origin': 'https://account.dianping.com',
        'Pragma': 'no-cache',
        'Referer': 'https://account.dianping.com/',
        'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36'
    }
    url = "https://verify.meituan.com/v2/ext_api/login/verify"
    data = {'id': 71,
            'request_code': requestCode,
            'behavior': behavior,
            'fingerprint': "",
            '_token': _token}
    time.sleep(0.5)
    print(data)
    req = session.post(url=url, headers=headers, data=data)
    print(req.json())
    # return req.json().get("requestCode")


if __name__ == '__main__':
    # print(get_slide_code())
    get_encropy()

