# -*- coding: utf-8 -*-
import base64
import json
import random
import re
import time

from PIL import Image
import requests

from SlideImage import SlideCrack


def generate_trace(distance):
    """
    生成轨迹
    :param distance:
    :return:
    """
    start_x = random.randint(1531, 1536)
    start_y = random.randint(236, 238)

    stage1 = 0.4
    stage2 = 0.7

    tracks_list = [0]
    current = 0
    while current <= distance:
        if current <= distance * stage1:
            x_move = random.randint(3, 6)
        elif distance * stage1 < current <= distance * stage2:
            x_move = random.randint(1, 3)
        else:
            x_move = random.choice([0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0])
        current += x_move
        tracks_list.append(current)
    # tracks_list.append(distance)
    # 生成时间戳列表
    timestamp = int(time.time() * 1000)
    timestamp_list = [timestamp]
    for i in range(1, len(tracks_list)):
        if i == 1:
            t = random.randint(150, 250)
        elif len(tracks_list) - 10 <= i < len(tracks_list) - 4:
            t = random.randint(20, 40)
        elif i >= len(tracks_list) - 4:
            t = random.randint(50, 150)
        else:
            t = random.randint(6, 9)
        timestamp += t
        timestamp_list.append(timestamp)
        i += 1
    y_list = []
    for j in range(len(tracks_list)):
        y = random.choice(
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
             0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0])
        y_list.append(y)
        j += 1
    trace = [['1128', '236', timestamp_list[0]]]
    for index, x in enumerate(tracks_list):
        trace.append([str(start_x + x), str(start_y + y_list[index]), timestamp_list[index]])
    print(trace)
    return trace[:-2]


class GeeTest(object):

    def __init__(self):
        self.sess = requests.session()
        self.sess.headers = {
            "accept": "*/*",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "zh-CN,zh;q=0.9",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "Host": "iv.jd.com",
            "Referer": "https://passport.jd.com/",
            "sec-ch-ua": '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "Sec-Fetch-Dest": "script",
            "Sec-Fetch-Mode": "no-cors",
            "Sec-Fetch-Site": "same-site",
            # "cookie": "ajssdk_2015_cross_new_user=1; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%221728e72b16044a-0293a04ab8b36a-e343166-2211840-1728e72b1619bd%22%2C%22%24device_id%22%3A%221728e72b16044a-0293a04ab8b36a-e343166-2211840-1728e72b1619bd%22%2C%22props%22%3A%7B%22%24latest_referrer%22%3A%22%22%2C%22%24latest_referrer_host%22%3A%22%22%2C%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_landing_page%22%3A%22https%3A%2F%2Fwww.geetest.com%2FSensebot%22%7D%7D; Hm_lvt_25b04a5e7a64668b9b88e2711fb5f0c4=1591527784; Hm_lpvt_25b04a5e7a64668b9b88e2711fb5f0c4=1591527784; 461cca3146ff093d059dee9439aa6b26=4eca7b9a-08e2-4921-9944-a421fbb42116",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36"
        }

    def get_sessionId(self):
        url = "https://seq.jd.com/jseqf.html?bizId=passport_jd_com_login_pc&platform=js&version=1"
        req = self.sess.get(url)
        data = re.search('.*var _jdtdmap_sessionId="(.*?)";.*', req.text, re.S)
        sessionId = data.group(1)
        if sessionId:
            self.sessionId = sessionId

    def get_jigsaw(self):
        tip = str(random.random()).replace(".", "")
        url = "https://iv.jd.com/slide/g.html?appId=1604ebb2287&scene=login&product=click-bind-suspend&e=4O76IPAS7HLF34FJQA7RRMFPHFJCOIODLAFDETUUEG7VHZSOFREHGGEGHNAFCZSVAO7HQIIJMVQRKVRDFTNX3JYEKI&lang=zh_CN&callback=jsonp_{}".format(tip)
        req = self.sess.get(url)
        data = re.search(".*jsonp.*?\((.*?)\).*", req.text, re.S)
        data = json.loads(data.group(1))
        if data:
            self.pic_bg = data.get("bg")
            self.pic_slice = data.get("patch")
            self.challenge = data.get("challenge")

    def download_pic(self):
        if self.pic_bg:
            data = base64.b64decode(self.pic_bg)
            with open("pic_bg.png", "wb") as f:
                f.write(data)
            im = Image.open("pic_bg.png")
            im = im.resize((278, 108), Image.ANTIALIAS)
            im.save("pic_bg.png")

        if self.pic_slice:
            data = base64.b64decode(self.pic_slice)
            with open("pic_slice.png", "wb") as f:
                f.write(data)
            im = Image.open("pic_slice.png")
            im = im.resize((38, 38), Image.ANTIALIAS)
            im.save("pic_slice.png")

    def get_distance(self):
        # 滑块图片
        image1 = "pic_slice.png"
        # 背景图片
        image2 = "pic_bg.png"
        sc = SlideCrack(image1, image2)
        self.distance = sc.discern()
        print(self.distance)

    def get_data(self):
        url = "http://127.0.0.1:8091/d"
        data = {
            "token": json.dumps({"data":generate_trace(self.distance)}),
        }
        req = requests.post(url, data)
        return req.text

    def slide_submit(self):
        url = "https://iv.jd.com/slide/s.html?"
        params = {
            "d": self.get_data(),
            "c": self.challenge,
            "w": 278,
            "appId": "1604ebb2287",
            "scene": "login",
            "product": "click-bind-suspend",
            "e": "4O76IPAS7HLF34FJQA7RRMFPHFJCOIODLAFDETUUEG7VHZSOFREHGGEGHNAFCZSVAO7HQIIJMVQRKVRDFTNX3JYEKI",
            "s": self.sessionId,
            "o": "",
            "lang": "zh_CN",
            "callback": "jsonp_{}".format(str(random.random()).replace(".", ""))
        }
        req = self.sess.get(url, params=params)
        # print(req.text)
        data = re.search(".*jsonp.*?\((.*?)\).*", req.text, re.S)
        data = json.loads(data.group(1))
        print(data)
        # return data["data"]["result"]


if __name__ == '__main__':
    for i in range(50):
        gee = GeeTest()
        gee.get_jigsaw()
        gee.download_pic()
        gee.get_sessionId()
        gee.get_distance()
        time.sleep(2)
        gee.slide_submit()
