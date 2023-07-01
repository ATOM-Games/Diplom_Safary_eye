import math

import numpy
from PIL import Image
from os import listdir
from os.path import isfile, join
import cv2
import numpy as np

image_path = 'images/learn'
image_txt = 'images/txt'


onlyfiles = [f for f in listdir(image_path) if isfile(join(image_path, f))]
print(onlyfiles)

def flip_hor(im, lines, name_save):
    im_l_r = im.transpose(Image.FLIP_LEFT_RIGHT)
    im_l_r.save(image_path + '/' + name_save[0] + "_f_l_r." + name_save[1], quality=95)
    new_lines = ''
    for line in lines:  # 0 - class name 1 - x centra 2 - y centra 3 - shirina 4 - vysota
        new_x = round( (1 - float(line.split(' ')[1])), 6)
        new_y = round(float(line.split(' ')[2]), 6)
        new_w = round(float(line.split(' ')[3]), 6)
        new_h = round(float(line.split(' ')[4]), 6)
        new_lines += (
                line.split(' ')[0] + ' ' + new_x.__str__() + ' ' + new_y.__str__() + ' ' + new_w.__str__() + ' ' +
                new_h.__str__() + '\n'
        )
    f = open(image_txt + '/' + name_save[0] + '_f_l_r.txt', 'w')
    f.write(new_lines)
    f.close()

def flip_ver(im, lines, name_save):
    im_l_r = im.transpose(Image.FLIP_TOP_BOTTOM)
    im_l_r.save(image_path + '/' + name_save[0] + "_f_t_b." + name_save[1], quality=95)
    new_lines = ''
    for line in lines:  # 0 - class name 1 - x centra 2 - y centra 3 - shirina 4 - vysota
        new_x = round(float(line.split(' ')[1]), 6)
        new_y = round((1 - float(line.split(' ')[2])), 6)
        new_w = round(float(line.split(' ')[3]), 6)
        new_h = round(float(line.split(' ')[4]), 6)
        new_lines += (
                line.split(' ')[0] + ' ' + new_x.__str__() + ' ' + new_y.__str__() + ' ' + new_w.__str__() + ' ' +
                new_h.__str__() + '\n'
        )
    f = open(image_txt + '/' + name_save[0] + '_f_t_b.txt', 'w')
    f.write(new_lines)
    f.close()

def rotate_90(im, lines, name_save):
    im_r_90 = im.rotate(90, expand=True)
    im_r_90.save(image_path + '/' + name_save[0] + "_r_90." + name_save[1], quality=95)

    new_lines = ''
    for line in lines:  # 0 - class name; 1 - x centra; 2 - y centra; 3 - shirina; 4 - vysota;
        new_x = round(float(line.split(' ')[2]), 6)
        new_y = round((1 - float(line.split(' ')[1])), 6)
        new_w = round(float(line.split(' ')[4]), 6)
        new_h = round(float(line.split(' ')[3]), 6)
        new_lines += (
                line.split(' ')[0] + ' ' + new_x.__str__() + ' ' + new_y.__str__() + ' ' + new_w.__str__() + ' ' +
                new_h.__str__() + '\n'
        )
    f = open(image_txt + '/' + name_save[0] + '_r_90.txt', 'w')
    f.write(new_lines)
    f.close()

def rotate_180(im, lines, name_save):
    im_r_180 = im.rotate(180, expand=True)
    im_r_180.save(image_path + '/' + name_save[0] + "_r_180." + name_save[1], quality=95)

    new_lines = ''
    for line in lines:  # 0 - class name; 1 - x centra; 2 - y centra; 3 - shirina; 4 - vysota;
        new_x = round((1 - float(line.split(' ')[1])), 6)
        new_y = round((1 - float(line.split(' ')[2])), 6)
        new_w = round(float(line.split(' ')[3]), 6)
        new_h = round(float(line.split(' ')[4]), 6)
        new_lines += (
                line.split(' ')[0] + ' ' + new_x.__str__() + ' ' + new_y.__str__() + ' ' + new_w.__str__() + ' ' +
                new_h.__str__() + '\n'
        )
    f = open(image_txt + '/' + name_save[0] + '_r_180.txt', 'w')
    f.write(new_lines)
    f.close()

def rotate_270(im, lines, name_save):
    im_r_270 = im.rotate(270, expand=True)
    im_r_270.save(image_path + '/' + name_save[0] + "_r_270." + name_save[1], quality=95)
    new_lines = ''
    for line in lines:  # 0 - class name; 1 - x centra; 2 - y centra; 3 - shirina; 4 - vysota;
        new_x = round((1 - float(line.split(' ')[2])), 6)
        new_y = round(float(line.split(' ')[1]), 6)
        new_w = round(float(line.split(' ')[4]), 6)
        new_h = round(float(line.split(' ')[3]), 6)
        new_lines += (
                line.split(' ')[0] + ' ' + new_x.__str__() + ' ' + new_y.__str__() + ' ' + new_w.__str__() + ' ' +
                new_h.__str__() + '\n'
        )
    f = open(image_txt + '/' + name_save[0] + '_r_270.txt', 'w')
    f.write(new_lines)
    f.close()


def coords(old_x, old_y):
    new_x = old_x * 0.7071 - old_y * 0.7071 + 0.5
    new_y = old_x * 0.7071 + old_y * 0.7071 + 0.5
    return new_x/2, new_y/2

def coords2(old_x, old_y, cx, cy, rad):
    R_X = cx
    R_Y = cy
    new_x = (old_x-R_X) * math.cos(math.radians(rad)) - (old_y-R_Y) * math.sin(math.radians(rad))
    new_y = (old_x-R_X) * math.sin(math.radians(rad)) + (old_y-R_Y) * math.cos(math.radians(rad))
    return new_x + R_X, new_y + R_Y

def razmer(old_w, old_h, rad):
    new_w = old_w * math.fabs(math.cos(math.radians(rad))) + old_h * math.fabs(math.sin(math.radians(rad)))
    new_h = old_w * math.fabs(math.sin(math.radians(rad))) + old_h * math.fabs(math.cos(math.radians(rad)))
    return new_w, new_h


def rotate_45(im, lines, name_save):
    R = 45
    im_r_45 = im.rotate(R, expand=True)
    im_r_45.save(image_path + '/45r/' + name_save[0] + "_r_45." + name_save[1], quality=95)
    W_W = im.width
    H_H = im.height
    W_Wn = im_r_45.width
    H_Hn = im_r_45.height

    new_lines = ''
    for line in lines:  # 0 - class name; 1 - x centra; 2 - y centra; 3 - shirina; 4 - vysota;
        cx = round(float(line.split(' ')[1]), 6)
        cy = round(float(line.split(' ')[2]), 6)
        cw = round(float(line.split(' ')[3]), 6)
        ch = round(float(line.split(' ')[4]), 6)

        nx = int(W_W * cx)
        ny = int(H_H * cy)
        nw = int(W_W * cw)
        nh = int(H_H * ch)

        C_X = int(W_W / 2)
        C_Y = int(H_H / 2)

        nn_x, nn_y = coords2(nx, ny, C_X, C_Y, -R)

        plus_x = (W_Wn - W_W) / 2
        plus_y = (H_Hn - H_H) / 2

        c1 = [int(nx - nw / 2), int(ny - nh / 2)]
        c2 = [int(nx - nw / 2), int(ny + nh / 2)]
        c3 = [int(nx + nw / 2), int(ny - nh / 2)]
        c4 = [int(nx + nw / 2), int(ny + nh / 2)]
        c1x, c1y = coords2(c1[0], c1[1], C_X, C_Y, -R)
        c2x, c2y = coords2(c2[0], c2[1], C_X, C_Y, -R)
        c3x, c3y = coords2(c3[0], c3[1], C_X, C_Y, -R)
        c4x, c4y = coords2(c4[0], c4[1], C_X, C_Y, -R)

        nn_x += plus_x
        nn_y += plus_y

        c1x += plus_x
        c1y += plus_y
        c2x += plus_x
        c2y += plus_y
        c3x += plus_x
        c3y += plus_y
        c4x += plus_x
        c4y += plus_y

        y_max = -20000000000
        y_min = 20000000000
        x_max = -20000000000
        x_min = 20000000000
        #
        if (c1x > x_max): x_max = c1x
        if (c1x < x_min): x_min = c1x
        if (c1y > y_max): y_max = c1y
        if (c1y < y_min): y_min = c1y
        #
        if (c2x > x_max): x_max = c2x
        if (c2x < x_min): x_min = c2x
        if (c2y > y_max): y_max = c2y
        if (c2y < y_min): y_min = c2y
        #
        if (c3x > x_max): x_max = c3x
        if (c3x < x_min): x_min = c3x
        if (c3y > y_max): y_max = c3y
        if (c3y < y_min): y_min = c3y
        #
        if (c4x > x_max): x_max = c4x
        if (c4x < x_min): x_min = c4x
        if (c4y > y_max): y_max = c4y
        if (c4y < y_min): y_min = c4y

        _r_w = x_max - x_min
        _r_h = y_max - y_min
        _r_x = x_min + _r_w / 2
        _r_y = y_min + _r_h / 2

        new_x = round((_r_x / W_Wn), 6)
        new_y = round((_r_y / H_Hn), 6)
        new_w = round((_r_w / W_Wn), 6)
        new_h = round((_r_h / H_Hn), 6)

        new_lines += (
                line.split(' ')[0] + ' ' + new_x.__str__() + ' ' + new_y.__str__() + ' ' + new_w.__str__() + ' ' +
                new_h.__str__() + '\n'
        )
    f = open(image_path + '/45r/' + name_save[0] + '_r_45.txt', 'w')
    f.write(new_lines)
    f.close()

def rename_files(im, lines, name_save, index):
    im_r_0 = im.rotate(0, expand=True)
    im_r_0.save(image_path + '/newnew/' + index.__str__() + "." + name_save[1], quality=95)
    new_lines = ''
    for line in lines:  # 0 - class name; 1 - x centra; 2 - y centra; 3 - shirina; 4 - vysota;
        cx = round(float(line.split(' ')[1]), 6)
        cy = round(float(line.split(' ')[2]), 6)
        cw = round(float(line.split(' ')[3]), 6)
        ch = round(float(line.split(' ')[4]), 6)
        new_lines += (
                line.split(' ')[0] + ' ' + cx.__str__() + ' ' + cy.__str__() + ' ' + cw.__str__() + ' ' +
                ch.__str__() + '\n'
        )
    f = open(image_path + '/newnew/' + index.__str__() + '.txt', 'w')
    f.write(new_lines)
    f.close()


indx = 0

for one_file in onlyfiles:
    print(one_file)
    name_save = one_file.split('.')
    print(name_save)
    im = Image.open(image_path+'/'+one_file) # openImage
    # open txt
    lines = []
    with open(image_txt + '/' + name_save[0] + '.txt') as f:
        lines = f.readlines()

    # rotate_45(im, lines, name_save)

    # flip_hor(im, lines, name_save)

    # flip_ver(im, lines, name_save)

    # rotate_90(im, lines, name_save)

    # rotate_180(im, lines, name_save)

    # rotate_270(im, lines, name_save)

    # rename_files(im, lines, name_save, indx)
    indx = indx + 1



def ffff():
    ########
    # rotates
    # im_r_90 = im.rotate(90, expand=True)
    # im_r_90.save(image_path + '/' + name_save[0] + "_r_90." + name_save[1], quality=95)
    # im_r_180 = im.rotate(180, expand=True)
    # im_r_180.save(image_path + '/' + name_save[0] + "_r_180." + name_save[1], quality=95)
    # im_r_270 = im.rotate(270, expand=True)
    # im_r_270.save(image_path + '/' + name_save[0] + "_r_270." + name_save[1], quality=95)
    im_r_45 = im.rotate(45, expand=True)
    im_r_45.save(image_path + '/' + name_save[0] + "_r_45." + name_save[1], quality=95)
    im_r_135 = im.rotate(135, expand=True)
    im_r_135.save(image_path + '/' + name_save[0] + "_r_135." + name_save[1], quality=95)
    im_r_225 = im.rotate(225, expand=True)
    im_r_225.save(image_path + '/' + name_save[0] + "_r_225." + name_save[1], quality=95)
    im_r_315 = im.rotate(315, expand=True)
    im_r_315.save(image_path + '/' + name_save[0] + "_r_315." + name_save[1], quality=95)

    # flip
    # im_l_r = im.transpose(Image.FLIP_LEFT_RIGHT)
    # im_l_r.save(image_path + '/' + name_save[0] + "_f_l_r." + name_save[1], quality=95)
    # im_t_b = im.transpose(Image.FLIP_TOP_BOTTOM)
    # im_t_b.save(image_path + '/' + name_save[0] + "_f_t_b." + name_save[1], quality=95)

# im = Image.open('guido-van-rossum.jpg')
# im.show()


