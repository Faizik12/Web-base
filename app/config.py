import os
import logging

import dotenv

dotenv.load_dotenv()

logger = logging.getLogger(__name__)


class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')
    if not SECRET_KEY:
        logger.critical('Отсутствует переменная окружения: SECRET_KEY')
        raise RuntimeError('SECRET_KEY запрашивается, но отсутствует в окружении')

    DATABASE_URL = os.getenv('DATABASE_URL')
    if not DATABASE_URL:
        logger.critical('Отсутствует переменная окружения: DATABASE_URL')
        raise RuntimeError('DATABASE_URL запрашивается, но отсутствует в окружении')
