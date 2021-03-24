# -*- coding: utf-8 -*-
from PIL import Image
import cv2


class PicRecover(object):
    def __init__(self, bgname, hkname):
        """
        :param bgname: 背景图片名称
        :param hkname: 滑块图片名称
        """
        self.bgname = bgname
        self.hkname = hkname

    def t_include(self, t, idx):
        """
        查看当前列表t中是否存在值idx
        :param t: 列表
        :param idx: 当前字节码
        :return:
        """
        if idx in t:
            return True
        for value in t:
            if value == idx:
                return True
        return False

    def get_slid_pic(self, r):
        """
        获取图片的切割列表
        :param r: 图片的名称
        :return: 返回图片的切割列表
        """
        t = []
        if r.startswith("."):
            r = r.split("/")[-1]
        for idx, value in enumerate(r):
            n = ord(value)
            while self.t_include(t, n % 32):
                n += 1
            t.append(n % 32)
        return t

    def get_bj_name(self):
        """
        根据图片位置合并还原图像并保存为jpg
        :return: 还原后的图像名称
        """
        if self.bgname.startswith("."):
            location_list = self.get_slid_pic("."+self.bgname.split(".")[1])
        else:
            location_list = self.get_slid_pic(self.bgname.split(".")[0])
        im = Image.open(self.bgname)
        width, height = im.size

        new_im = Image.new('RGB', (width, height))
        im_map = {}

        for idx in range(32):
            im_map[idx] = im.crop((idx * 12, 0, (idx + 1) * 12, height))
        im_map[32] = im.crop((32 * 12, 0, 32 * 12 + 16, height))

        for idx, value in enumerate(location_list):
            new_im.paste(im_map[value], (idx * 12, 0))
        new_im.paste(im_map[32], (32 * 12, 0))
        new_im = new_im.resize((300, 150), Image.ANTIALIAS)
        try:
            new_im.save(self.bgname.split(".")[0] + ".png")
            return self.bgname.split(".")[0] + ".png"
        except ValueError:
            new_im.save("."+self.bgname.split(".")[1] + ".png")
            return "."+self.bgname.split(".")[1] + ".png"

    def get_hk_name(self):
        im = Image.open(self.hkname)
        im = im.resize((45, 45), Image.ANTIALIAS)
        try:
            im.save(self.hkname.split(".")[0] + ".png")
            return self.hkname.split(".")[0] + ".png"
        except ValueError:
            im.save("."+self.hkname.split(".")[1] + ".png")
            return "."+self.hkname.split(".")[1] + ".png"

    def get_pic_name(self):
        bg_name = self.get_bj_name()
        hk_name = self.get_hk_name()
        return bg_name, hk_name


class SlideCrack(object):
    def __init__(self, gap, bg, out="3_3.png"):
        """
        init code
        :param gap: 缺口图片(滑块图片)
        :param bg: 背景图片
        :param out: 输出图片
        """
        self.gap = gap
        self.bg = bg
        self.out = out

    @staticmethod
    def clear_white(img):
        # 清除图片的空白区域，这里主要清除滑块的空白
        img = cv2.imread(img)
        rows, cols, channel = img.shape
        min_x = 255
        min_y = 255
        max_x = 0
        max_y = 0
        for x in range(1, rows):
            for y in range(1, cols):
                t = set(img[x, y])
                if len(t) >= 2:
                    if x <= min_x:
                        min_x = x
                    elif x >= max_x:
                        max_x = x

                    if y <= min_y:
                        min_y = y
                    elif y >= max_y:
                        max_y = y
        img1 = img[min_x:max_x, min_y: max_y]
        return img1

    def template_match(self, tpl, target):
        result = cv2.matchTemplate(target, tpl, cv2.TM_CCOEFF_NORMED)
        # 寻找矩阵(一维数组当作向量,用Mat定义) 中最小值和最大值的位置
        min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)
        tl = max_loc
        # # 将图片黑白化并标注出缺口
        th, tw = tpl.shape[:2]
        br = (tl[0] + tw, tl[1] + th)
        # 绘制矩形边框，将匹配区域标注出来
        # target：目标图像
        # tl：矩形定点
        # br：矩形的宽高
        # (0,0,255)：矩形边框颜色
        # 1：矩形边框大小
        cv2.rectangle(target, tl, br, (0, 0, 255), 2)
        cv2.imwrite(self.out, target)
        return tl[0]

    @staticmethod
    def image_edge_detection(img):
        edges = cv2.Canny(img, 500, 600)
        return edges

    def discern(self):
        img1 = self.clear_white(self.gap)
        img1 = cv2.cvtColor(img1, cv2.COLOR_RGB2GRAY)
        slide = self.image_edge_detection(img1)
        cv2.imwrite("slide.jpg", slide)

        back = cv2.imread(self.bg, 0)
        back = self.image_edge_detection(back)
        cv2.imwrite("back.jpg", back)

        slide_pic = cv2.cvtColor(slide, cv2.COLOR_GRAY2RGB)
        back_pic = cv2.cvtColor(back, cv2.COLOR_GRAY2RGB)
        x = self.template_match(slide_pic, back_pic)
        # 输出横坐标, 即 滑块在图片上的位置
        # print(x)
        return x


if __name__ == "__main__":
    # 待还原背景图片
    bgname = "b1f5de698cd445dd8d6b56bb5ba1b358.webp"
    # 待转换的滑块图片
    hkname = "e8e77ad7def341aeadaf7d41caa61891.webp"
    pr = PicRecover(bgname, hkname)
    im_name = pr.get_pic_name()

    # 滑块图片
    image1 = im_name[1]
    # 背景图片
    image2 = im_name[0]
    # # 处理结果图片,用红线标注
    # image3 = "3_3.png"
    # sc = SlideCrack(image1, image2, image3)
    # sc.discern()
    sc = SlideCrack(image1, image2)
    print(sc.discern() - 15 + 10)
