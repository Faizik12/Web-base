from backend.routes.databases import databases_bp
from backend.routes.sr_management import sr_management_bp



def register_routers(app):
    app.register_blueprint(databases_bp)
    app.register_blueprint(sr_management_bp)
