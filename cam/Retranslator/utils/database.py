import sqlite3 as sql

global _db_file


def init_local_storage(db_file):
    global _db_file
    _db_file = db_file


class DBA:
    def __init__(self):
        self.__con_str = _db_file

    def execute(self, query, params=None):
        if params is None:
            params = []
        with sql.connect(self.__con_str) as con:
            return con.execute(query, params)

    def executemany(self, query, params=None):
        if params is None:
            params = []
        with sql.connect(self.__con_str) as con:
            return con.executemany(query, params)
