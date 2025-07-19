from datetime import datetime
from werkzeug.exceptions import BadRequest


def is_valid_date_ddmmyyyy(value):
    try:
        datetime.strptime(value, '%d-%m-%Y')
        return True
    except (ValueError, TypeError):
        return False

def validate_ot_record(data):
    errors = {}

    for field in ['first_name', 'last_name', 'middle_name', 'position']:
        if field not in data or not isinstance(data[field], str) or not data[field].strip():
            errors[field] = 'Обязательное поле, непустая строка'
        elif len(data[field]) > 50:
            errors[field] = f'Длина не должна превышать {50} символов'

    eb_group = data.get('eb_group')
    if not isinstance(eb_group, int) or not (0 <= eb_group <= 32767):
        errors['eb_group'] = 'Должно быть целым числом от 0 до 32767'

    for field in ['is_engineer', 'is_worker']:
        if field not in data or not isinstance(data[field], bool):
            errors[field] = 'Обязательное булево поле'

    if 'is_engineer' in data and 'is_worker' in data:
        if int(data['is_engineer']) + int(data['is_worker']) != 1:
            errors['role'] = 'Должна быть ровно одна роль: инженер или рабочий'

    date_fields_required = [
        'employment_start_date',
        'eb_exam_previous_date', 'eb_exam_planned_date', 'eb_exam_actual_date',
        'ot_exam_previous_date', 'ot_exam_planned_date', 'ot_exam_actual_date',
        'pb_instruction_planned_date', 'pb_instruction_actual_date',
    ]
    date_fields_optional = [
        'height_work_exam_previous_date', 'height_work_exam_planned_date', 'height_work_exam_actual_date',
        'retraining_planned_date', 'retraining_actual_date',
        'ot_training_actual_date', 'ot_training_planned_date',
    ]

    for field in date_fields_required:
        value = data.get(field)
        if not isinstance(value, str) or not is_valid_date_ddmmyyyy(value):
            errors[field] = 'Обязательное поле. Формат даты: ДД-MM-ГГГГ (например, 31-12-2025)'

    for field in date_fields_optional:
        value = data.get(field)
        if value is not None:
            if not isinstance(value, str) or not is_valid_date_ddmmyyyy(value):
                errors[field] = 'Формат даты: ДД-MM-ГГГГ (например, 31-12-2025)'

    if errors:
        raise BadRequest(description=errors) # type: ignore


def validate_inspection_schedule(data):
    errors = {}

    name = data.get('name')
    if not name or not isinstance(name, str) or not name.strip():
        errors['name'] = 'Обязательное поле, непустая строка'
    elif len(name) > 100:
        errors['name'] = f'Длина не должна превышать {100} символов'

    planned_date = data.get('inspection_planned_date')
    if not isinstance(planned_date, str) or not is_valid_date_ddmmyyyy(planned_date):
        errors['inspection_planned_date'] = 'Обязательное поле. Формат даты: ДД-MM-ГГГГ (например, 31-12-2025)'

    actual_date = data.get('inspection_actual_date')
    if actual_date is not None:
        if not isinstance(actual_date, str) or not is_valid_date_ddmmyyyy(actual_date):
            errors['inspection_actual_date'] = 'Формат даты: ДД-MM-ГГГГ (например, 31-12-2025)'

    if errors:
        raise BadRequest(description=errors) # type: ignore
