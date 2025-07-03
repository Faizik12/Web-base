import os
import logging

from flask import Flask, send_from_directory, abort

from backend.config import Config
from backend.logging_config import configure_logging
from backend.routes import register_routers
from backend.error_handlers import register_error_handlers

BUILD_DIR = os.path.join(os.path.dirname(__file__), 'frontend', 'build')

configure_logging()
logger = logging.getLogger(__name__)
logger.info('Конфигурация логирования завершена')

app = Flask(
    __name__,
    static_folder=BUILD_DIR,
    static_url_path=''
)
logger.info('Экземпляр приложения создан')

app.config.from_object(Config)
logger.info('Конфигурация приложения завершена')


@app.route('/')
@app.route('/<path:path>')
def serve_react(path=''):
    try:
        if path and os.path.exists(os.path.join(app.static_folder, path)): # type: ignore
            return send_from_directory(app.static_folder, path) # type: ignore
        else:
            return send_from_directory(app.static_folder, 'index.html') # type: ignore
    except Exception:
        logger.exception('Ошибка при отдаче статики')
        abort(500)

register_routers(app)
logger.info('Регистрация маршрутов завершена')

register_error_handlers(app)
logger.info('Регистрация обработчиков ошибок завершена')

logger.info('Приложение настроено и готово к работе')
