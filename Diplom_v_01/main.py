import PIL.Image
import cv2
from YOLOv5.exp_01_v5 import Detector, setDetStatus, getDetStatus, getResImg, setResImg, DetMy
from flask import Flask, jsonify, request, make_response, render_template, json
from flask_cors import CORS
import requests
from PIL import Image
import numpy as np
from base64 import b64decode
from cv2 import imdecode, IMREAD_COLOR
import sys
from flask_socketio import SocketIO
from myUtils.sockets import socket_send_message, init_socket_messages
 

params = dict()
for line in open("ServerConfig.cfg", "r").readlines():
    p_name, p_val = line.split("=")
    params[p_name.strip()] = p_val.strip()
app = Flask(__name__, template_folder='web', static_folder='web')
CORS(app)

app.config['SECRET_KEY'] = "SECRET_KEY"
socket_io = SocketIO(app)
#   Запуск отправки сокет-сообщений
init_socket_messages(socket_io)


global_result = None

camera = "10.0.0.125:10001"

listeners = []

_IMAGE_SIZE = [800, 600]

#########  GLOBAL RESES
_GLOBAL_RES = {
    '_MAX_FRAMES' : 5,
    '_IMG' : '-=-=',
    '_RESES' : [
        [],
        [],
        [],
        [],
        []
    ]
}

def PushRes(res):
    global _GLOBAL_RES
    i = _GLOBAL_RES['_MAX_FRAMES'] - 1
    while i > 0:
        _GLOBAL_RES['_RESES'][i] = _GLOBAL_RES['_RESES'][i-1]
        i = i-1
    _GLOBAL_RES['_RESES'][0] = res

def isAll():
    global _GLOBAL_RES
    res = 0
    i = _GLOBAL_RES['_MAX_FRAMES'] - 1
    while i > 0:
        if _GLOBAL_RES['_RESES'][i] is not [] :
            res = res + 1
            i = i - 1
    return res == _GLOBAL_RES['_MAX_FRAMES']
@app.route('/get_global_res', methods=['POST'])
def get_global_res():
    global _GLOBAL_RES
    print('get global')
    print(_GLOBAL_RES['_RESES'])
    return jsonify(_GLOBAL_RES)

#########################################

last_res = None

def NewDetect(s1, s2):
    setDetStatus('Detect')
    global last_res
    global camera
    global listeners
    print(camera)
    while camera != '-':
        if getDetStatus() == 'OFF':
            break
        b64_frame = requests.post('http://'+camera+'/get_b64_frame').content

        cv_frame = b64_to_cv(b64_frame)
        cv_frame = cv2.resize(cv_frame, (640,640))
        img = DetMy(cv_frame, s1, s2)
        if getDetStatus() == 'OFF':
            break
        json_message = []
        if img is not []:
            #запросик
            last_res = img
            json_message.append({
                "name": "weapon",
                "res": img
            })
            sendMess(json_message, listeners)
        else:
            if last_res is not None:
                last_res = None
                json_message.append({
                    "name": "weapon",
                    "res": []
                })
            print("zapros")
            sendMess(json_message, listeners)
    print("SSSTOOOPPEEED")


gun_cascade = cv2.CascadeClassifier('cascade_new.xml')


def resize(x, size):
    return float(float(x) / float(size))
def refactor(guns):
    if len(guns) > 0:
        str_str = []
        print('guns')
        print(guns)
        for (x, y, w, h) in guns:
            str_str.append(
                {
                    'pos': {
                        'x': resize(x, _IMAGE_SIZE[0]),
                        'y': resize(y, _IMAGE_SIZE[1]),
                        'w': resize(w, _IMAGE_SIZE[0]),
                        'h': resize(h, _IMAGE_SIZE[1])
                    }
                }
            )
        return str_str
    else :
        return []

def NewDetect3(s1, s2):
    setDetStatus('Detect')
    global last_res
    global camera
    global listeners
    global _GLOBAL_RES
    print(camera)
    while camera != '-':
        if getDetStatus() == 'OFF':
            break
        b64_frame = requests.post('http://'+camera+'/get_b64_frame').content
        _GLOBAL_RES['_IMG'] = b64_frame.__str__()
        cv_frame = b64_to_cv(b64_frame)
        cv_frame = cv2.resize(cv_frame, (480, 480))
        img = DetMy(cv_frame, s1, s2)
        if getDetStatus() == 'OFF':
            break
        json_message = []
        if img is not []:
            #запросик
            last_res = img
            json_message.append({
                "name": "weapon",
                "res": img
            })
            sendMess(json_message, listeners)
        else:
            if last_res is not None:
                last_res = None
                json_message.append({
                    "name": "weapon",
                    "res": []
                })
            print("zapros")
            sendMess(json_message, listeners)
        PushRes(img)
    print("SSSTOOOPPEEED")
    cv2.destroyAllWindows()

def NewDetect2(s1, s2):
    setDetStatus('Detect')
    global last_res
    global camera
    global listeners
    global _GLOBAL_RES
    print(camera)
    while camera != '-':
        b64_frame = requests.post('http://'+camera+'/get_b64_frame').content
        _GLOBAL_RES['_IMG'] = b64_frame.__str__()
        cv_frame = b64_to_cv(b64_frame)
        cv_frame = cv2.resize(cv_frame, (_IMAGE_SIZE[0], _IMAGE_SIZE[1]))
        #img = DetMy(cv_frame, s1, s2) # analysis

        gray = cv2.cvtColor(cv_frame, cv2.COLOR_BGR2GRAY)
        gun = refactor(gun_cascade.detectMultiScale(gray, 1.2, 115, minSize=(100, 100)))

        if getDetStatus() == 'OFF':
            break
        if gun is not []:
            #запросик
            last_res = gun
            json_message = []
            json_message.append({
                "name": "weapon",
                "res": gun
            })
            sendMess(json_message, listeners)
        else:
            if last_res is not None:
                last_res = None
                json_message = []
                json_message.append({
                    "name": "weapon",
                    "res": []
                })
                sendMess(json_message, listeners)
            print("zapros")

        PushRes(gun)

    print("SSSTOOOPPEEED")



def b64_to_cv(b64):
    _bytes = b64decode(b64)
    np_arr = np.frombuffer(_bytes, dtype=np.uint8)
    cv = imdecode(np_arr, flags=IMREAD_COLOR)
    return cv


def sendMess(json_message, listeners):
    #if isAll():
    for listener in listeners:
        requests.post(listener, json=json_message).content

@app.route('/')
def index():
    return """<h1>I am Alive</h1>"""

@app.route('/admin', methods=['GET'])
def admin():
    return render_template("templates/admin/index.html")

@app.route('/status', methods=['POST'])
def status():
    global camera
    det = request.get_json(force=True)['detect']
    camera = request.get_json(force=True)['camera'].__str__()
    s1 = float(request.get_json(force=True)['step_01'])
    s2 = float(request.get_json(force=True)['step_02'])
    if(getDetStatus() == 'OFF') and det == 'start':
        NewDetect3(s1, s2)
    if(getDetStatus() == 'Detect') and det == 'stop':
        setDetStatus('OFF')
    return """<h1>I am Alive</h1>"""

@app.route('/getStatus', methods=['POST'])
def getStatus():
    return jsonify({ "status": getDetStatus() })



@app.route('/resultDetect', methods=['POST'])
def resultDetect():
    det = request.get_json(force=True).get("address")
    if det:
        res = requests.post(det).json()
        return jsonify({"res_img": res["res_img"], "status": "Detect", "detectes": []})
    else:
        ND, dets = getResImg()
        return jsonify({ "res_img": ND, "status" : getDetStatus(), "detectes": dets })

@app.route('/www', methods=['POST'])
def wwwww():
    print(request.json)
    print(request.data)
    print(request.form)
    return 200

@app.route('/subscribe', methods=['POST'])
def subscribe():
    global listeners
    det = request.get_json(force=True).get("address")
    det2 = request.get_json(force=True).get("method")
    print('subscrupt')
    print("!!!!!"+det+" "+det2)
    if(det in listeners):
        print('have')
    else :
        listeners.append(det)
    print(listeners)
    return jsonify({ 'm' : 'm' })




if __name__ == '__main__':
    socket_io.run(app, host='127.0.0.1', port=5003, debug=bool(params["debug"]))