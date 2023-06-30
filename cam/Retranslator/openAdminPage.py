from utils.configuration import init_config, cfg_get
from utils.database import init_local_storage
from webbrowser import open_new_tab


DB_FILE = "db/local_storage.db"
#   Запуск работы с бд
init_local_storage(DB_FILE)
#   Запуск ведения конфигурации
init_config(
    type="sqlite",
    config_table="config"
)

url = f"http://{cfg_get('host', str)}:{cfg_get('port', str)}/admin"
open_new_tab(url)
