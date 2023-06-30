from flask import jsonify


def success_response(data=None):
    response = {
        "status": "success"
    }
    if data:
        response["data"] = data
    return jsonify(response)


def error_response(data=None):
    response = {
        "status": "error"
    }
    if data:
        response["data"] = data
    return jsonify(response)
