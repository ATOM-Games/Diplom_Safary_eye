
from flask import Flask, jsonify, request, json, render_template, session, abort, send_file, Response
from flask_socketio import SocketIO
import ctypes
import os
from components.imageProviding import start_provider
from utils.logging import start_logger, log_message
from utils.response_presets import success_response, error_response
from utils.configuration import init_config, cfg_set, cfg_get, cfg_save
from utils.sockets import socket_send_message, init_socket_messages
from utils.database import init_local_storage


os.system("cls")
ctypes.windll.kernel32.SetConsoleTitleW('Ретранслятор')

DB_FILE = "db/local_storage.db"
LOG_FOLDER = "logs"
SECRET_KEY = 'secret key'
TEMPLATE_FOLDER = 'web'
STATIC_FOLDER = 'web'
DEBUG = False

#   Запуск работы с бд
init_local_storage(DB_FILE)
#   Запуск ведения конфигурации
init_config(
    type="sqlite",
    config_table="config"
)
#   Запуск ведения логов
start_logger(LOG_FOLDER)

#   Настройка сервера
app = Flask(
    __name__,
    template_folder=TEMPLATE_FOLDER,
    static_folder=STATIC_FOLDER
)
app.config['SECRET_KEY'] = SECRET_KEY
socket_io = SocketIO(app)
#   Запуск отправки сокет-сообщений
init_socket_messages(socket_io)

#   Запуск источника изображения
provider = start_provider(
    mode=cfg_get("mode", str),
    id=cfg_get("device_id", int),
    fps=cfg_get("fps", int)
)

log_message("Запуск")


#
#   Админ страница
#


#   Админ страница
@app.route('/admin', methods=['GET'])
def admin():
    started = provider.is_started()
    cfg = dict()
    params = [
        "host",
        "port",
        "fps",
        "mode",
        "device_id",
        "ip_camera_address"
    ]
    for param in params:
        cfg[param] = cfg_get(param, str)
    address = f"http://{cfg.get('host')}:{cfg.get('port')}"
    return render_template("templates/admin/admin.html", started=started, address=address, cfg=cfg)


#   Запустить захват видео
@app.route('/start', methods=['POST'])
def start():
    provider.start_provider()
    success = provider.is_started()
    if success:
        return success_response()
    else:
        return error_response()


#   Остановить захват видео
@app.route('/stop', methods=['POST'])
def stop():
    provider.stop_provider()
    return success_response()


#   Изменить и сохранить настройки
@app.route('/save_config', methods=['POST'])
def save_config():
    req = request.form

    changed_cfg = json.loads(req["changed_cfg"])
    for key in changed_cfg:
        value = changed_cfg[key]
        cfg_set(key, value)
    try:
        cfg_save()
    except:
        return error_response()
    log_message("Изменены настройки")
    return success_response()


#   Перезапустить источник изображения
@app.route('/refresh', methods=['POST'])
def refresh():
    global provider
    provider.stop()
    try:
        provider = start_provider(
            mode=cfg_get("mode", str),
            id=cfg_get("device_id", int),
            fps=cfg_get("fps", int)
        )
        log_message("Конфигурация обновлена")
        return success_response()
    except:
        return error_response()


#
#   Другие
#


@app.route('/test', methods=['GET'])
def test():
    return render_template("templates/test/test.html")


#   Получить изображение формата b64 в виде байтов
@app.route('/get_b64_frame', methods=['POST'])
def get_b64_frame():
    frame = provider.get_frame()
    return frame


#   Получить изображение формата b64 в виде json
@app.route('/get_b64_frame_json', methods=['POST'])
def get_b64_frame_json():
    frame = provider.get_frame()
    frame = str(frame)[2:-1]
    return success_response({"b64_frame": frame})


#   Запуск сервера
if __name__ == '__main__':
    socket_io.run(
        app,
        host='10.0.0.179',
        port=cfg_get('port', int),
        debug=DEBUG
    )
