from threading import Thread
import os
import time
import datetime
from queue import Queue

global logger


#   Сохранение логов в файл
class LoggingThread(Thread):

    def __init__(self, log_folder=f"logs"):
        super().__init__(daemon=True)
        self.buffer = Queue()
        self.folder = log_folder
        if not os.path.exists(self.folder):
            os.makedirs(self.folder)
        global logger
        logger = self

    def run(self):

        while True:
            time.sleep(0.1)
            self.__write_log()

    #   Запись из буфера в файл
    def __write_log(self):
        if self.buffer.empty():
            return

        log_str = self.buffer.get() + "\n"
        cur_date = datetime.datetime.now().date()
        cur_time = str(datetime.datetime.now().time()).split(".")[0]
        with open(f"{self.folder}\\{cur_date}.txt", "a") as file:
            file.write(f"{cur_time}\t{log_str}")

    #   Запись в буфер
    def log(self, message):
        self.buffer.put(message)


#   Запустить ведение логов
def start_logger(log_folder):
    _logger = LoggingThread(log_folder)
    _logger.start()
    global logger
    logger = _logger
    return _logger


#   Добавить сообщение к логу и вывести его на консоль
def log_message(mes, _print=True):
    logger.log(mes)
    if _print:
        print(mes)
