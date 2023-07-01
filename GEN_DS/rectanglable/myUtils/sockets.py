
global _socket


def init_socket_messages(socket):
    global _socket
    _socket = socket


def socket_send_message(data):
    _socket.emit('message', data)


def socket_send_error(text="Ошибка", action=""):
    if type(text) is not str or type(action) is not str:
        raise Exception("Illegal argument")
    _socket.emit('error', {
        "text": text,
        "action": action
    })


def socket_init_action(action=""):
    if type(action) is not str:
        raise Exception("Illegal argument")
    _socket.emit('action', {
        "action": action
    })
