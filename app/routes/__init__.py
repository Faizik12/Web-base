from app.routes.main import main_bp


def register_routers(app):
    app.register_blueprint(main_bp)
