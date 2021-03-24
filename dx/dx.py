# -*- coding: utf-8 -*-
import json
import math
import random
import time

import requests

from DXImaRecovery import PicRecover, SlideCrack


class DingXiang(object):
    def __init__(self):
        self.distance = 0
        self.y = 0
        self.param1 = ""
        self.param2 = ""
        self.c = ""
        self.sid = ""
        self.p1 = ""
        self.p2 = ""
        self.bgname = ""
        self.hkname = ""
        self.sess = requests.session()
        self.sess.headers = {
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "zh-CN,zh;q=0.9",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "Referer": "https://www.dingxiang-inc.com/",
            'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'cross-site',
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36"
        }

    def get_option(self):
        url = "https://constid.dingxiang-inc.com/udid/c1?"
        req = self.sess.options(url)
        print("get_option")
        print(req.text)

    def get_data(self, param):
        c_status = False
        self.sess.headers.update({"Param": param})
        url = "https://constid.dingxiang-inc.com/udid/c1?"
        req = self.sess.get(url)
        print("param")
        print(req.text)
        data = req.json()
        if data and data.get("data"):
            self.c = data["data"]
            c_status = True
        self.sess.headers.pop("Param")
        return c_status

    def get_param1(self):
        url = "http://127.0.0.1:8091/param1"
        req = requests.get(url)
        self.param1 = req.text

    def get_param2(self):
        url = "http://127.0.0.1:8091/param2"
        req = requests.get(url)
        self.param2 = req.text

    def get_dic(self):
        self.get_option()
        self.get_param1()
        c_status = self.get_data(self.param1)
        if c_status:
            return c_status
        self.get_option()
        self.get_param2()
        self.get_data(self.param2)

    def get_pic(self):
        pic_status = False
        self.sess.headers.update({
            "Host": "constid.dingxiang-inc.com",
            "Origin": "https://www.dingxiang-inc.com",
            "accept": "application/json, text/plain, */*"})
        try:
            self.sess.headers.pop("Param")
        except KeyError:
            pass
        url = "https://cap.dingxiang-inc.com/api/a?"
        param = {
            "w": 300,
            "h": 150,
            "s": 50,
            "ak": "99de95ad1f23597c23b3558d932ded3c",
            "c": "",
            "jsv": "1.4.5.1",
            "aid": "dx-1616047381786-88070638-2",
            "wp": 1,
            "de": 0,
            "uid": "",
            "lf": 0,
            "tpc": "",
            "_r": math.radians(16)
        }
        req = self.sess.get(url, params=param)
        print(req.text)
        data = req.json()
        if data:
            self.sid = data["sid"]
            self.y = int(data["y"])
            self.p1 = data["p1"]
            self.p2 = data["p2"]
            pic_status = True
        return pic_status

    def get_pic_again(self):
        url = "https://cap.dingxiang-inc.com/api/a?"
        param = {
            "w": 300,
            "h": 150,
            "s": 50,
            "ak": "99de95ad1f23597c23b3558d932ded3c",
            "c": self.c,
            "jsv": "1.4.5.1",
            "aid": "dx-1616481387310-35134212-2",
            "sid": self.sid,
            "wp": 1,
            "de": 0,
            "uid": "",
            "lf": 0,
            "tpc": "",
            "_r": math.radians(16)
        }
        req = self.sess.get(url, params=param)
        print(req.text)
        data = req.json()
        if data:
            self.sid = data["sid"]
            self.y = int(data["y"])
            self.p1 = data["p1"]
            self.p2 = data["p2"]

    def download_pic(self):
        try:
            self.sess.headers.pop("Host")
            self.sess.headers.pop("Origin")
        except KeyError:
            pass
        self.sess.headers.update({"accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"})
        if self.p1:
            url = "https://static.dingxiang-inc.com/picture/{}".format(self.p1)
            req = self.sess.get(url)
            self.bgname = "./img/" + self.p1.split("/")[-1]
            with open(self.bgname, "wb") as f:
                f.write(req.content)
        if self.p2:
            url = "https://static.dingxiang-inc.com/picture/{}".format(self.p2)
            req = self.sess.get(url)
            self.hkname = "./img/" + self.p2.split("/")[-1]
            with open(self.hkname, "wb") as f:
                f.write(req.content)
        self.sess.headers.update({
            "Host": "constid.dingxiang-inc.com",
            "Origin": "https://www.dingxiang-inc.com",
            "accept": "application/json, text/plain, */*"})

    def get_distance(self):
        pr = PicRecover(self.bgname, self.hkname)
        im_name = pr.get_pic_name()
        sc = SlideCrack(im_name[1], im_name[0])
        self.distance = sc.discern() - 5
        print(self.distance)

    def get_track_move(self):
        # [[37758, 1143, 1176], [37766, 1144, 1176], [37774, 1145, 1176], [37782, 1146, 1176], [37790, 1149, 1176], [37806, 1151, 1176], [37815, 1152, 1176], [37831, 1154, 1176], [37838, 1155, 1176], [37848, 1157, 1176], [37854, 1158, 1176], [37864, 1160, 1176], [37870, 1162, 1176], [37881, 1164, 1176], [37896, 1167, 1175], [37902, 1168, 1175], [37912, 1170, 1175], [37918, 1172, 1175], [37927, 1175, 1175], [37935, 1176, 1175], [37942, 1179, 1174], [37949, 1182, 1174], [37960, 1186, 1174], [37967, 1189, 1174], [37974, 1191, 1174], [37982, 1194, 1174], [37990, 1196, 1174], [37998, 1198, 1174], [38006, 1200, 1174], [38022, 1201, 1174], [38031, 1203, 1174], [38039, 1204, 1174], [38047, 1206, 1174], [38054, 1208, 1174], [38064, 1212, 1174], [38070, 1219, 1174], [38079, 1224, 1174], [38086, 1232, 1174], [38094, 1240, 1174], [38103, 1250, 1174], [38110, 1256, 1174], [38117, 1264, 1174], [38126, 1271, 1174], [38134, 1278, 1174], [38142, 1283, 1174], [38150, 1287, 1174], [38158, 1290, 1174], [38167, 1291, 1174], [38174, 1292, 1174], [38239, 1293, 1174], [38247, 1294, 1174], [38254, 1295, 1174], [38265, 1297, 1174], [38270, 1300, 1174], [38281, 1304, 1174], [38288, 1306, 1174], [38296, 1309, 1174], [38302, 1313, 1174], [38310, 1316, 1174], [38319, 1319, 1174], [38326, 1320, 1174], [38342, 1321, 1174], [38399, 1322, 1174], [38416, 1323, 1174], [38438, 1324, 1174], [38454, 1327, 1173], [38513, 1328, 1173], [38527, 1329, 1173], [38535, 1330, 1173], [38574, 1331, 1173], [38590, 1332, 1173], [38606, 1333, 1173], [38614, 1334, 1173], [38623, 1335, 1173], [38639, 1336, 1173], [38654, 1338, 1173], [38664, 1338, 1174], [38687, 1339, 1174], [38703, 1340, 1174], [38719, 1341, 1174], [38743, 1342, 1174], [38757, 1343, 1174], [38766, 1344, 1175], [38807, 1345, 1175], [38823, 1346, 1175], [38835, 1347, 1175], [38847, 1348, 1175], [38864, 1349, 1175], [38870, 1350, 1175], [38886, 1351, 1175], [38902, 1352, 1176], [38911, 1352, 1177], [38942, 1353, 1177]]
        pass

    def get_ac(self):
        url = "http://127.0.0.1:8091/en"
        data = {
            "token": self.sid,
            "silde": json.dumps({"us": self.get_track_move()}),
            "tag": "x={}&y={}".format(self.distance+10, self.y)
        }
        req = requests.post(url, data=data)
        print(req.text)
        return req.text

    def slide_submit(self):
        url = "https://cap.dingxiang-inc.com/api/v1"
        data = {
            "ac": self.get_ac(),
            "ak": "99de95ad1f23597c23b3558d932ded3c",
            "c": self.c,
            "uid": "",
            "jsv": "1.4.5.1",
            "sid": self.sid,
            "aid": "dx-1616481387310-35134212-2",
            "x": self.distance + 10,
            "y": self.y
        }
        self.sess.headers.update({
            "Host": "cap.dingxiang-inc.com"})
        req = self.sess.post(url, data=data)
        # print(req.text)
        print(req.json())

    def main(self):
        pic_status = self.get_pic()
        self.get_dic()
        if not pic_status:
            self.get_pic_again()
        self.download_pic()
        self.get_distance()
        time.sleep(2)
        self.slide_submit()


if __name__ == '__main__':
    dx = DingXiang()
    dx.main()

