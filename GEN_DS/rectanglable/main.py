from flask import Flask, jsonify, request, make_response, render_template,json
from flask_cors import CORS
from flask_socketio import SocketIO
from myUtils.sockets import socket_send_message, init_socket_messages
from os import listdir
from os.path import isfile, join
from io import BytesIO
from PIL import Image
import base64

app = Flask(__name__, template_folder='web', static_folder='web')
CORS(app)
app.config['SECRET_KEY'] = "SECRET_KEY"
socket_io = SocketIO(app)
#   Запуск отправки сокет-сообщений
init_socket_messages(socket_io)


@app.route('/')
def index():
    return render_template("templates/admin/index.html")

@app.route('/getNames', methods=['POST'])
def post_getNames():
    print('getNames')
    address_pic = request.get_json(force=True).get("address_pic")
    address_txt = request.get_json(force=True).get("address_txt")
    print(address_pic)
    print(address_txt)
    onlyfiles = [f for f in listdir(address_pic) if isfile(join(address_pic, f))]
    print(onlyfiles)
    names = []
    for one_name in onlyfiles :
        lines = []
        let = address_txt+'/'+one_name.split('.')[0]+'.txt'
        print(let)
        try:
            with open(address_txt+'/'+one_name.split('.')[0]+'.txt') as f:
                lines = f.readlines()
        except Exception as e:
            print(e)
        elem = {
            'name_value': one_name.split('.'),
            'txt_value': lines
        }
        names.append(elem)


    return jsonify(
        {
            "address_pic": address_pic,
            "names": names
        }
    )

@app.route('/getPicture', methods=['POST'])
def post_getPicture():
    print('getPicture')
    address_pic = request.get_json(force=True).get("address_pic")
    encoded_image = ""
    with open(address_pic, "rb") as f:
        encoded_image = base64.b64encode(f.read())

    return jsonify(
        {
            "img": encoded_image.__str__()
        }
    )



if __name__ == '__main__':
    socket_io.run(app, host='127.0.0.1', port=2323, debug=False)