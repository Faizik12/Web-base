from flask import Flask

from app.config import Config
from app.logging_config import configure_logging
from app.routes import register_routers


configure_logging()

app = Flask(__name__)
app.config.from_object(Config)

register_routers(app)
