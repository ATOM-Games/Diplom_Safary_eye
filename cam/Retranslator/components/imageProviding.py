
from pyautogui import screenshot
from threading import Thread
from time import time, sleep
from cv2 import VideoCapture, CAP_DSHOW

from utils.logging import log_message
from utils.converting import convert_image_from_camera, pil_to_b64, cv_to_b64
from utils.sockets import socket_send_error, socket_init_action


#   Запуск чтения видеопотока
def start_provider(mode, fps, **params):
    _provider = ImageProvider(mode, int(fps), **params)
    _provider.start()
    return _provider


#   Получает изображение из различных источников и кодирует в base64
class ImageProvider(Thread):

    def __init__(self, mode="device", fps=10, **params):
        super().__init__(daemon=True)
        self.__b64_frame = None
        self.__fps = fps
        self.__prev_cap = 0
        self.__mode = mode
        self.__params = params
        self.__provider_started = False
        self.__stopped = False
        self.__cap = None

    #   Получить последний кадр
    def get_frame(self):
        return self.__b64_frame

    #   Выполнить при запуске потока
    def run(self):
        try:
            self.__capture()
        except Exception as ex:
            log_message(str(ex))
            socket_send_error(str(ex))
        finally:
            self.__stopped = True
            self.__stop_provider()

    #   Вызвать остановку потока
    def stop(self):
        self.__stopped = True

    #   Запустить захват видео
    def start_provider(self):
        if self.__stopped:
            return False
        if self.__provider_started:
            return True
        self.__provider_started = True
        log_message("Захват изображения запущен")
        success = True
        #if self.__cap:
        #    success = self.__open_cap()
        return success

    #   Возообновить захват изображения
    def __open_cap(self):
        success = True
        if self.__mode == "device":
            _id = int(self.__params["id"])
            self.__cap.open(_id, CAP_DSHOW)
            success = self.__cap.isOpened()
        return success

    #   Захват видео из разных источников
    def __capture(self):
        if self.__mode == "device":
            self.__capture_from_connected_device()
        elif self.__mode == "screen":
            self.__capture_from_screen()

    #   Захват видео с подключенной камеры
    def __capture_from_connected_device(self):
        _id = int(self.__params["id"])
        self.__cap = VideoCapture(_id, CAP_DSHOW)
        while not self.__stopped:
            sleep(0.001)
            if self.__provider_started and self.__cap_is_opened():
                if self.__cap_timer():
                    success, frame = self.__cap.read()
                    if success:
                        frame = convert_image_from_camera(frame)
                        b64_frame = cv_to_b64(frame)
                        self.__b64_frame = b64_frame
                    else:
                        log_message("Ошибка чтения изображения")
                        self.__stop_provider()

    #   Захват видео с экрана
    def __capture_from_screen(self):
        while not self.__stopped:
            sleep(0.001)
            if self.__provider_started:
                if self.__cap_timer():
                    frame = screenshot()
                    b64_frame = pil_to_b64(frame)
                    self.__b64_frame = b64_frame

    #   Таймер интервала чтения видео
    def __cap_timer(self):
        passed_time = time() - self.__prev_cap
        if passed_time > 1. / self.__fps:
            self.__prev_cap = time()
            return True
        return False

    #   Остановить захват видео
    def stop_provider(self):
        self.__stop_provider()

    #   Остановить захват видео
    def __stop_provider(self):
        self.__provider_started = False
        #if self.__cap:
        #    self.__cap.release()
        socket_init_action("stop")
        log_message("Захват изображения остановлен")

    #   Запущен ли захват видео
    def is_started(self):
        return self.__provider_started

    #   Проверка открыто ли подключение
    def __cap_is_opened(self):
        if self.__cap.isOpened():
            return True
        else:
            log_message("Соединение с устройством не удалось")
            socket_send_error(text="Соединение с устройством не удалось")
            self.__stop_provider()
