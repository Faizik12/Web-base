from flask import jsonify
from werkzeug.exceptions import HTTPException, BadRequest

ERROR_MESSAGES = {
    404: 'Ресурс не найден',
    500: 'Внутренняя ошибка сервера'
}

def register_error_handlers(app):
    @app.errorhandler(Exception)
    def handle_exception(e):
        if isinstance(e, HTTPException):
            code = e.code
            message = getattr(e, 'description', None) or ERROR_MESSAGES.get(code, e.name) # type: ignore
        else:
            code = 500
            message = 'Произошла непредвиденная ошибка'
        return jsonify(error=message), code
