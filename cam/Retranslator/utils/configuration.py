from utils.database import DBA
from abc import abstractmethod

global _cfg


#   Запуск ведения конфигурации
def init_config(**params):
    if params["type"] == "sqlite":
        _dba = DBA()
        global _cfg
        _cfg = SQLiteConfiguration(_dba, params["config_table"])


#   Получить параметр
def cfg_get(key, cast_type=None):
    global _cfg
    value = _cfg.get_param(key)
    if cast_type:
        value = cast_type(value)
    return value


#   Установить параметр
def cfg_set(key, value):
    global _cfg
    _cfg.set_param(key, value)


#   Сохранить конфиг
def cfg_save():
    global _cfg
    _cfg.save_config()


#   Интерфейс конфигов
class _Configuration:
    @abstractmethod
    def load_config(self):
        pass

    @abstractmethod
    def save_config(self):
        pass

    @abstractmethod
    def set_param(self, key, value):
        pass

    @abstractmethod
    def get_param(self, key):
        pass


#   Конфиг в SQLite
class SQLiteConfiguration(_Configuration):
    def __init__(self, dba, cfg_table):
        self.__dba = dba
        self.__cfg_table = cfg_table
        self.__cfg_dict, self.__cfg_changed = self.load_config()

    #   Загрузить настройки из файла
    def load_config(self):
        params = dict()
        changed_params = dict()
        sql = f"SELECT * FROM {self.__cfg_table}"
        rows = self.__dba.execute(sql)
        for key, value in rows:
            params[key] = value
            changed_params[key] = False
        return params, changed_params

    #   Сохранить настройки в файл
    def save_config(self):
        params = []
        for key in self.__cfg_dict:
            if self.__cfg_changed[key]:
                value = self.__cfg_dict[key]
                params.append([value, key])
        self.__dba.executemany(f"UPDATE {self.__cfg_table} SET param_value = ? WHERE param_name = ?", params)

    #   Установить параметр
    def set_param(self, key, value):
        self.__cfg_dict[key] = value
        self.__cfg_changed[key] = True

    #   Получить параметр
    def get_param(self, key):
        return self.__cfg_dict.get(key)


#   Конфиг в виде файла
class FileConfiguration(_Configuration):
    def __init__(self, cfg_file):
        self.__cfg_file = cfg_file
        self.__cfg_dict = self.load_config()

    #   Загрузить настройки из файла
    def load_config(self):
        _params = dict()
        for line in open(self.__cfg_file, "r").readlines():
            p_name, p_val = line.split("=")
            _params[p_name.strip()] = p_val.strip()
        return _params

    #   Сохранить настройки в файл
    def save_config(self):
        lines = []
        for key in self.__cfg_dict:
            value = self.__cfg_dict[key]
            lines.append(f"{key} = {value}\n")
        with open(self.__cfg_file, "w") as file:
            file.writelines(lines)

    #   Установить параметр
    def set_param(self, key, value):
        self.__cfg_dict[key] = value

    #   Получить параметр
    def get_param(self, key):
        return self.__cfg_dict.get(key)
