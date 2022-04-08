from threading import Thread
from queue import Queue
import socket
from datetime import datetime
from time import sleep
from dingtalkchatbot.chatbot import DingtalkChatbot

class DingTalkEngine(object):
    # 发送钉钉机器人消息
    def __init__(self):
        """"""
        super(DingTalkEngine, self).__init__()

        self.thread = Thread(target=self.run)
        self.queue = Queue()
        self.active = False

    def send_ding_talk(self, content):
        # 内容添加电脑名称、时间
        client = socket.gethostname()
        full_content = f'【{client}】\n\n{datetime.now()}\n\n{content}'

        # 开启线程
        if not self.active:
            self.start()

        # 消息推入队列，做流控处理
        if self.queue.qsize() < 10:
            self.queue.put(full_content)

    def run(self):
        """"""
        while self.active:
            try:
                content = self.queue.get(block=True, timeout=1)

                # 发送消息
                webhook = 'https://oapi.dingtalk.com/robot/send?access_token=c7829ba703a3e0a28fb43f40a65f68313ec3ab43324e5bad30bd2bb660f791e4'
                ding = DingtalkChatbot(webhook)
                ding.send_text(msg=content, is_at_all=True)
            except:
                pass
            sleep(2)

    def start(self) -> None:
        """"""
        self.active = True
        self.thread.start()

    def close(self) -> None:
        """"""
        if not self.active:
            return

        self.active = False
        self.thread.join()