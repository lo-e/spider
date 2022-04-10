from base import BaseSpider
from urllib import request, parse
import traceback
from bs4 import BeautifulSoup
import re
from dataclasses import dataclass
from ding_talk import DingTalkEngine
from time import sleep

nft_link_re = re.compile(r'<a class="last-souvenirs-card-wrapper" href="(.*?)">')
image_link_re = re.compile(r'<img alt=.*src="(.*?)"/>')
nft_name_re = re.compile(r'<span class="text-wrapper text">(.*?)</span>')

# 钉钉通知
dingtalk = DingTalkEngine()

@dataclass
class Dapp(BaseSpider):
    name:str = ''                       # 详情链接
    earn:int = 0                        # 奖励

# 主程序
def dappback():
    dapp_names = []
    name_dapp_dic = {}
    initing = True

    while True:
        # 获取数据
        sucess_ = False
        baseUrl = 'https://dappback.com/'
        html = askUrl(url=baseUrl, parms=None, timeout=60)

        # 解析
        if html:
            soup = BeautifulSoup(html, 'html.parser')
            item_list = soup.find_all('li', class_='last-souvenirs-card-wrapper')
            for item in item_list:
                data = Dapp()
                item_str = str(item)

                nft_link_list = re.findall(nft_link_re, item_str)
                if len(nft_link_list):
                    data.nft_link = baseUrl + nft_link_list[0]

                image_link_list = re.findall(image_link_re, item_str)
                if len(image_link_list):
                    data.image_link = baseUrl + image_link_list[0]

                nft_name_list = re.findall(nft_name_re, item_str)
                if len(nft_name_list):
                    data.nft_name = nft_name_list[0]

                if data.name and data.name not in dapp_names:
                    dapp_names.append(data.name)
                    name_dapp_dic[data.name] = data

                    if not initing:
                        # 有新的dapp产生
                        content = f'【Dappback更新】\n{data.name}\n{data.earn}'
                        dingtalk.send_ding_talk(content=content)

                sucess_ = True

        # 查询间隔
        if initing:
            content = '【Dappback Initing...】'
            show_count = min(9, len(dapp_names))
            for i in range(0, show_count):
                content += f'\n{dapp_names[i]}'
            dingtalk.send_ding_talk(content=content)

        elif not sucess_:
            content = '【Dappback Error...\nChecking!!】'
            dingtalk.send_ding_talk(content=content)

        initing = False
        sleep(5*60)

# 获取数据
def askUrl(url:str, parms:dict=None, wrapped=True, timeout:int=10):
    data = None
    if parms:
        data = bytes(parse.urlencode(parms), encoding='utf-8')

    try:
        # 直接请求
        if not wrapped:
            response = request.urlopen(url, timeout=10, data=data)

            # status = response.status
            # print(status, '\n')
            # header = response.headers
            # print(header, '\n')
            html = response.read().decode('utf-8')
            return html

        else:
            # 封装请求头
            request_headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36',
                               'accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                               'sec-ch-ua-platform': "Windows"}
            if data:
                req = request.Request(url=url, headers=request_headers, data=data, method='POST')
            else:
                req = request.Request(url=url, headers=request_headers)
            response = request.urlopen(req, timeout=timeout)

            html = response.read().decode('utf-8')
            return html
    except:
        exc = traceback.format_exc()
        dingtalk.send_ding_talk(content=f'【Expo 请求出错...】\n{exc}')
        print(exc)

if __name__ == '__main__':
    dappback()