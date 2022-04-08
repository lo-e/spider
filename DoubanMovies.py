from urllib import request, parse
import traceback
from bs4 import BeautifulSoup
import re
from dataclasses import dataclass
import xlwt

movie_link_re = re.compile(r'<a href="(.*?)">')
image_link_re = re.compile(r'<img.*src="(.*?)"', re.S)
movie_name_re = re.compile(r'<span class="title">(.*?)</span>')
movie_rating_re = re.compile(r'<span class="rating_num" property="v:average">(.*?)</span>')
rating_number_re = re.compile(r'<span>(.*?)人评价</span>')
movie_brief_re = re.compile(r'<span class="inq">(.*?)</span>')
movie_from_re = re.compile(r'<p class="">(.*?)</p>', re.S)

# ===============================
# BeautifulSoup
# Tag
# NavigableString
# Comment
# ===============================
@dataclass
class MovieData(object):
    movie_link:str = ''             # 详情链接
    image_link:str = ''             # 封面
    movie_name:str = ''             # 影片名
    movie_rating:float = 0.0        # 评分
    rating_number:int = 0           # 点评数
    movie_brief:str = ''            # 简介
    movie_from:str = ''             # 演员国家地区等说明

# 主程序
def douban():
    data_list = []
    baseUrl = 'https://movie.douban.com/top250?start='
    # 获取数据
    for i in range(0, 10):
        url = baseUrl + str(i*25)
        html = askUrl(url=url, parms=None)
        # 解析
        soup = BeautifulSoup(html, 'html.parser')
        item_list = soup.find_all('div', class_='item')
        for item in item_list:
            data = MovieData()
            item_str = str(item)

            movie_link_list = re.findall(movie_link_re, item_str)
            if len(movie_link_list):
                data.movie_link = movie_link_list[0]

            image_link_list = re.findall(image_link_re, item_str)
            if len(image_link_list):
                data.image_link = image_link_list[0]

            movie_name_list = re.findall(movie_name_re, item_str)
            if len(movie_name_list):
                data.movie_name = movie_name_list[0]

            movie_rating_list = re.findall(movie_rating_re, item_str)
            if len(movie_rating_list):
                data.movie_rating = movie_rating_list[0]

            rating_number_list = re.findall(rating_number_re, item_str)
            if len(rating_number_list):
                data.rating_number = rating_number_list[0]

            movie_brief_list = re.findall(movie_brief_re, item_str)
            if len(movie_brief_list):
                data.movie_brief = movie_brief_list[0]

            movie_from_list = re.findall(movie_from_re, item_str)
            if len(movie_from_list):
                movie_from = movie_from_list[0].strip()
                data.movie_from = re.sub(r'<br.*/>', '', movie_from)

            data_list.append(data)

    print(f'获取电影数据：{len(data_list)}')
    # 保存
    dict_list = []
    for data in data_list:
        dict_list.append(data.__dict__)
    save_exel(dict_list)

# 获取数据
def askUrl(url:str, parms:dict=None, wrapped=True):
    data = None
    if parms:
        data = bytes(parse.urlencode(parms), encoding='utf-8')

    try:
        # 直接请求
        if not wrapped:
            response = request.urlopen(url, timeout=5, data=data)

            # status = response.status
            # print(status, '\n')
            # header = response.headers
            # print(header, '\n')
            html = response.read().decode('utf-8')
            return html

        else:
            # 封装请求头
            request_headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36'}
            if data:
                req = request.Request(url=url, headers=request_headers, data=data, method='POST')
            else:
                req = request.Request(url=url, headers=request_headers)
            response = request.urlopen(req, timeout=5)

            html = response.read().decode('utf-8')
            return html
    except:
        exc = traceback.format_exc()
        print(exc)

# 保存数据
def save_exel(data_list:list):
    excel = xlwt.Workbook(encoding='utf-8')
    sheet = excel.add_sheet('Douban_Movies_Top250')

    for i, data in enumerate(data_list):
        if not isinstance(data, dict):
            return

        if i == 0:
            colums = data.keys()
            for n, col in enumerate(colums):
                sheet.write(0, n, col)

        for j, value in enumerate(data.values()):
            sheet.write(i+1, j, value)

    excel.save('./douban.xls')

def custom_find(tag):
    return tag.has_attr('id')

def find():
    with open('./test.html', 'rb') as file:
        content = file.read()
        bs = BeautifulSoup(content, 'html.parser')

        # content = bs.head.contents[0]
        # print(content, '\n')

        # attrs = bs.a.attrs
        # print(attrs, '\n')

        # string = bs.title.string
        # print(string, '\n')

        # all = bs.find_all('a')[0]
        # print(all, '\n')

        # re_compile = bs.find_all(re.compile('a'))[0]
        # print(re_compile, '\n')

        # has_attr = bs.a.has_attr('')
        # print(has_attr)

        # custom_ = bs.find_all(custom_find)
        # for result in custom_:
        #     print(result, '\n')

        # attr_find = bs.find_all(class_='s-tab-item s-tab-tieba')
        # for result in attr_find:
        #     print(result, '\n')

        # text_find = bs.find_all(text=re.compile('\d'), limit=2)
        # for result in text_find:
        #     print(result, '\n')

        # 通过标签名
        # select_names = bs.select('a')
        # for result in select_names:
        #     print(result)

        # 通过标签类
        # select_class = bs.select('.toindex')
        # for result in select_class:
        #     print(result)

        # 通过id
        # select_id = bs.select('#wrapper_wrapper')
        # for result in select_id:
        #     print(result)

        # 通过属性
        # select_attr = bs.select('div[id="wrapper_wrapper"]')
        # for result in select_attr:
        #     print(result)

        # 通过子标签
        # select_children = bs.select('div > a')
        # for result in select_children:
        #     print(result)

        # 通过兄弟标签
        select_bro = bs.select('div ~ a')
        for result in select_bro:
            print(result)

if __name__ == '__main__':
    douban()