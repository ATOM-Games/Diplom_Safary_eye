from os import listdir
from os.path import isfile, join

classeses = [
    ['blade',0,'-1'],
    ['knife',0,'-1'],
    ['pistol_barrel_1',0,'-1'],
    ['pistol_hand_1',0,'-1'],
    ['pistol_1',0,'-1'],
    ['pistol_barrel_2',0,'-1'],
    ['pistol_hand_2',0,'-1'],
    ['pistol_2',0,'-1'],
    ['pistol_barrel_3',0,'-1'],
    ['pistol_hand_3',0,'-1'],
    ['pistol_3',0,'-1'],
    ['pistol_barrel_4',0,'-1'],
    ['pistol_hand_4',0,'-1'],
    ['pistol_4',0,'-1'],
    ['pistol_barrel_5',0,'-1'],
    ['pistol_hand_5',0,'-1'],
    ['pistol_5',0,'-1'],
    ['PP_barrel_1',0,'-1'],
    ['PP_hand_1',0,'-1'],
    ['PP_1',0,'-1'],
    ['PP_barrel_2',0,'-1'],
    ['PP_hand_2',0,'-1'],
    ['PP_2',0,'-1'],
    ['PP_barrel_3',0,'-1'],
    ['PP_hand_3',0,'-1'],
    ['PP_3',0,'-1'],
    ['PP_barrel_4',0,'-1'],
    ['PP_hand_4',0,'-1'],
    ['PP_4',0,'-1'],
    ['PP_barrel_5',0,'-1'],
    ['PP_hand_5',0,'-1'],
    ['PP_5',0,'-1'],
    ['automat_barrel_1',0,'-1'],
    ['automat_hand_1',0,'-1'],
    ['automat_1',0,'-1'],
    ['automat_barrel_2',0,'-1'],
    ['automat_hand_2',0,'-1'],
    ['automat_2',0,'-1'],
    ['automat_barrel_3',0,'-1'],
    ['automat_hand_3',0,'-1'],
    ['automat_3',0,'-1'],
    ['automat_barrel_4',0,'-1'],
    ['automat_hand_4',0,'-1'],
    ['automat_4',0,'-1'],
    ['automat_barrel_5',0,'-1'],
    ['automat_hand_5',0,'-1'],
    ['automat_5',0,'-1'],
    ['shutgun_barrel_1',0,'-1'],
    ['shutgun_hand_1',0,'-1'],
    ['shutgun_1',0,'-1'],
    ['shutgun_barrel_2',0,'-1'],
    ['shutgun_hand_2',0,'-1'],
    ['shutgun_2',0,'-1'],
    ['shutgun_barrel_3',0,'-1'],
    ['shutgun_hand_3',0,'-1'],
    ['shutgun_3',0,'-1'],
    ['shutgun_barrel_4',0,'-1'],
    ['shutgun_hand_4',0,'-1'],
    ['shutgun_4',0,'-1'],
    ['shutgun_barrel_5',0,'-1'],
    ['shutgun_hand_5',0,'-1'],
    ['shutgun_5',0,'-1']
]

def openFille(path_to_txt) :
    onlyfiles = [f for f in listdir(path_to_txt) if isfile(join(path_to_txt, f))]
    for one_file in onlyfiles:
        with open(path_to_txt + '/' + one_file) as f:
            lines = f.readlines()
            for line in lines:
                classeses[int(line.split(' ')[0])][1] += 1

openFille('labels/learn')
openFille('labels/eval')

print('result')
print(classeses)

def preobrazovanieMassiva():
    i=0
    for cls in classeses:
        if cls[1] > 0 :
            cls[2] = i
            i+=1
        else :
            continue

preobrazovanieMassiva()

print('result2')
print(classeses)

def saveFille(path_to_txt) :
    onlyfiles = [f for f in listdir(path_to_txt) if isfile(join(path_to_txt, f))]
    for one_file in onlyfiles:
        with open(path_to_txt + '/' + one_file) as f:
            lines = f.readlines()
            new_lines = ''
            for line in lines:  # 0 - class name 1 - x centra 2 - y centra 3 - shirina 4 - vysota
                new_x = round(float(line.split(' ')[1]), 6)
                new_y = round((1 - float(line.split(' ')[2])), 6)
                new_w = round(float(line.split(' ')[3]), 6)
                new_h = round(float(line.split(' ')[4]), 6)
                new_lines += (
                        classeses[int(line.split(' ')[0])][2].__str__()
                        + ' ' + new_x.__str__() + ' ' + new_y.__str__() + ' ' + new_w.__str__() + ' ' +
                        new_h.__str__() + '\n'
                )
            f = open(path_to_txt + '/' + one_file, 'w')
            f.write(new_lines)
            f.close()

saveFille('labels/learn')
saveFille('labels/eval')