import logging

from flask import Blueprint, jsonify, abort, request

from backend.parsers import parse_ot_record_dates, parse_inspection_schedule
from backend.validators import validate_ot_record, validate_inspection_schedule
from backend.services.sr_management import get_ot_records, get_inspection_schedules, delete_ot_record, delete_inspection_schedule, create_ot_record, create_inspection_schedule, full_update_ot_record, full_update_inspection_schedule

sr_management_bp = Blueprint('sr_management', __name__, url_prefix='/api')
logger = logging.getLogger(__name__)

@sr_management_bp.get('/ot_records')
def get_ot_records_api():
    data = get_ot_records()
    return jsonify(data), 200

@sr_management_bp.post('/ot_records')
def add_ot_record_api():
    payload = request.json
    if payload is None:
        abort(400, description='Отсутствуют тело запроса')

    data = payload.get('data')
    if data is None:
        abort(400, description='Отсутствуют данные для создания записи')

    validate_ot_record(data)
    parsed_data = parse_ot_record_dates(data)
    record = create_ot_record(parsed_data)
    return jsonify(record), 201

@sr_management_bp.get('/ot_records/<int:id>')
def get_ot_record_api(id):
    return jsonify(error='Not implemented yet'), 501

@sr_management_bp.put('/ot_records/<int:id>')
def update_ot_record_api(id):
    payload = request.json
    if payload is None:
        abort(400, description='Отсутствуют тело запроса')

    data = payload.get('data')
    if data is None:
        abort(400, description='Отсутствуют данные для обновления записи')

    validate_ot_record(data)
    parsed_data = parse_ot_record_dates(data)
    record = full_update_ot_record(id, parsed_data)
    return jsonify(record)

@sr_management_bp.delete('/ot_records/<int:id>')
def delete_ot_record_api(id):
    success = delete_ot_record(id)
    if not success:
        abort(404)
    return jsonify(message='Запись успешно удалена'), 200

@sr_management_bp.get('/inspection_schedules')
def get_inspection_schedules_api():
    data = get_inspection_schedules()
    return jsonify(data), 200

@sr_management_bp.post('/inspection_schedules')
def add_inspection_schedule_api():
    payload = request.json
    if payload is None:
        abort(400, description='Отсутствуют тело запроса')

    data = payload.get('data')
    if data is None:
        abort(400, description='Отсутствуют данные для создания записи')

    validate_inspection_schedule(data)
    parsed_data = parse_inspection_schedule(data)
    record = create_inspection_schedule(parsed_data)
    return jsonify(record), 201

@sr_management_bp.get('/inspection_schedules/<int:id>')
def get_inspection_schedule_api(id):
    return jsonify(error='Not implemented yet'), 501

@sr_management_bp.put('/inspection_schedules/<int:id>')
def update_inspection_schedule_api(id):
    payload = request.json
    if payload is None:
        abort(400, description='Отсутствуют тело запроса')

    data = payload.get('data')
    if data is None:
        abort(400, description='Отсутствуют данные для обновления записи')

    validate_inspection_schedule(data)
    parsed_data = parse_inspection_schedule(data)
    record = full_update_inspection_schedule(id, parsed_data)
    return jsonify(record)

@sr_management_bp.delete('/inspection_schedules/<int:id>')
def delete_inspection_schedule_api(id):
    success = delete_inspection_schedule(id)
    if not success:
        abort(404)
    return jsonify(message='Запись успешно удалена'), 200
