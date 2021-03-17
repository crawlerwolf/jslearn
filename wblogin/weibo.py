# -*- coding: utf-8 -*-
import json
import re
import time
import logging

import requests


LEVEL = logging.INFO


class Logger(object):
    '''
       指定保存日志的文件路径，日志级别，以及调用文件
       将日志存入到指定的文件中
    '''
    # 创建一个logger
    logger = logging.getLogger()
    logger.setLevel(LEVEL)

    # 创建一个handler，用于写入日志文件
    fh = logging.FileHandler('WeiBoLogin.txt')
    fh.setLevel(LEVEL)

    # 再创建一个handler，用于输出到控制台
    ch = logging.StreamHandler()
    ch.setLevel(LEVEL)

    # 定义handler的输出格式
    formatter = logging.Formatter('%(asctime)s  - %(levelname)s - %(message)s')
    fh.setFormatter(formatter)
    ch.setFormatter(formatter)

    # 给logger添加handler
    logger.addHandler(fh)
    logger.addHandler(ch)

    def getlog(self, message):
        logging.info(message)
        return ''


logger = Logger()


class WeiBoLogin(object):
    def __init__(self, username, pwd):
        self.su = ""
        self.servertime = ""
        self.nonce = ""
        self.rsakv = ""
        self.sp = ""
        self.user = username
        self.pwd = pwd
        self.sess = requests.session()
        self.sess.headers = {
            "accept": "application/json, text/plain, */*",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "zh-CN,zh;q=0.9",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "Host": "login.sina.com.cn",
            'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'cross-site',
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36"
        }

    def get_pr(self):
        self.sess.headers.update({"Referer": "https://s.weibo.com/"})
        url = "https://login.sina.com.cn/sso/prelogin.php?"
        params = {
            "entry": "weibo",
            "callback": "sinaSSOController.preloginCallBack",
            "su": "",
            "rsakt": "mod",
            "checkpin": 1,
            "client": "ssologin.js(v1.4.19)",
            "_": int(time.time() * 1000)
        }
        req = self.sess.get(url, params=params)
        data = re.search("^sina.*?\((.*?)\)", req.text, re.S)
        if data:
            data = json.loads(data.group(1))
            logger.getlog(data)

    def get_su(self):
        url = "http://127.0.0.1:8091/su"
        if not self.su:
            req = requests.post(url, data={"su": self.user})
            self.su = req.text

    def get_pre(self):
        self.sess.headers.update({"Referer": "https://s.weibo.com/"})
        url = "https://login.sina.com.cn/sso/prelogin.php?"
        params = {
            "entry": "weibo",
            "callback": "sinaSSOController.preloginCallBack",
            "su": self.su,
            "rsakt": "mod",
            "checkpin": 1,
            "client": "ssologin.js(v1.4.19)",
            "_": int(time.time() * 1000)
        }
        req = self.sess.get(url, params=params)
        data = re.search("^sina.*?\((.*?)\)", req.text, re.S)
        if data:
            data = json.loads(data.group(1))
            logging.info(data)
            self.servertime = data.get("servertime")
            self.nonce = data.get("nonce")
            self.rsakv = data.get("rsakv")

    def get_sp(self):
        url = "http://127.0.0.1:8091/sp"
        if not self.sp:
            req = requests.post(url, data={"pwd": self.pwd, "servertime": self.servertime, "nonce": self.nonce})
            self.sp = req.text

    def get_login(self):
        url = "https://login.sina.com.cn/sso/login.php?client=ssologin.js(v1.4.19)&_=1615960882774"
        self.sess.headers.update({"Referer": "https://s.weibo.com/", "Origin": "https://s.weibo.com"})
        params = {
            "client": "ssologin.js(v1.4.19)",
            "_": int(time.time() * 1000)
        }
        data = {
            "entry": "weibo",
            "gateway": 1,
            "from": "",
            "savestate": 0,
            "qrcode_flag": "false",
            "useticket": 1,
            "pagerefer": "https://s.weibo.com/weibo?q=%E5%B8%A6%E8%96%AA%E9%9A%BE%E8%BF%87&Refer=index",
            "vsnf": 1,
            "su": self.su,
            "service": "miniblog",
            "servertime": self.servertime,
            "nonce": self.nonce,
            "pwencode": "rsa2",
            "rsakv": self.rsakv,
            "sp": self.sp,
            "sr": "1920*1080",
            "encoding": "UTF-8",
            "cdult": 2,
            "domain": "weibo.com",
            "prelt": 18,
            "returntype": "TEXT"
        }
        req = self.sess.post(url, params=params, data=data)
        logger.getlog(req.json())

    def login(self):
        self.get_pr()
        self.get_su()
        self.get_pre()
        self.get_sp()
        self.get_login()


if __name__ == '__main__':
    wb = WeiBoLogin(username, pwd)
    wb.login()
