import logging

from flask import Blueprint, jsonify

from backend.services.databases import get_databases, get_tables

databases_bp = Blueprint('databases', __name__, url_prefix='/api')
logger = logging.getLogger(__name__)

@databases_bp.get('/databases')
def get_databases_api():
    data = get_databases()
    return jsonify(data), 200

@databases_bp.get('/databases/<int:logical_db_id>')
def get_tables_api(logical_db_id):
    data = get_tables(logical_db_id)
    return jsonify(data), 200

@databases_bp.post('/databases')
def add_database_api():
    return jsonify({'error': 'Not implemented yet'}), 501

@databases_bp.patch('/databases/<int:id>')
def update_database_api(id):
    return jsonify({'error': 'Not implemented yet'}), 501

@databases_bp.delete('/databases/<int:id>')
def delete_database_api(id):
    return jsonify({'error': 'Not implemented yet'}), 501
