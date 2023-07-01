from cv2 import imdecode, IMREAD_COLOR, cvtColor, COLOR_BGR2RGB, flip
from base64 import b64decode, b64encode
import numpy as np
from io import BytesIO
from PIL import Image


def b64_to_cv(b64):
    _bytes = b64decode(b64)
    np_arr = np.frombuffer(_bytes, dtype=np.uint8)
    cv = imdecode(np_arr, flags=IMREAD_COLOR)
    return cv


def b64_to_pil(b64):
    _bytes = b64decode(b64)
    buffer = BytesIO(_bytes)
    pil = Image.open(buffer)
    return pil


def cv_to_pil(cv):
    pil = Image.fromarray(cv)
    return pil


def pil_to_cv(pil):
    cv = np.asarray(pil)
    return cv


def pil_to_b64(pil):
    _bytes = BytesIO()
    pil.save(_bytes, format="JPEG")
    b64 = b64encode(_bytes.getvalue())
    return b64


def cv_to_b64(cv):
    pil = cv_to_pil(cv)
    b64 = pil_to_b64(pil)
    return b64


def flip_cv(cv):
    return flip(cv, 1)


def bgr_to_rgb_cv(cv):
    return cvtColor(cv, COLOR_BGR2RGB)


def convert_image_from_camera(cv):
    cv = flip_cv(cv)
    cv = bgr_to_rgb_cv(cv)
    return cv


def round_float(f, r):
    return float(f*10**r//1/10**r)
