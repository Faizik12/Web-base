from datetime import datetime

def parse_date_string(date_str):
    return datetime.strptime(date_str, '%d-%m-%Y').date()

def parse_ot_record_dates(data):
    date_fields = {
        'employment_start_date',
        'eb_exam_previous_date', 'eb_exam_planned_date', 'eb_exam_actual_date',
        'ot_exam_previous_date', 'ot_exam_planned_date', 'ot_exam_actual_date',
        'pb_instruction_planned_date', 'pb_instruction_actual_date',
        'height_work_exam_previous_date', 'height_work_exam_planned_date', 'height_work_exam_actual_date',
        'retraining_planned_date', 'retraining_actual_date',
        'ot_training_actual_date', 'ot_training_planned_date',
    }

    parsed_data = data.copy()
    for field, value in parsed_data.items():
        if field in date_fields and value is not None:
            parsed_data[field] = parse_date_string(value)
        elif isinstance(value, str):
            parsed_data[field] = value.lower()

    return parsed_data

def parse_inspection_schedule(data):
    date_fields = {'inspection_planned_date', 'inspection_actual_date'}

    parsed_data = data.copy()
    for field, value in parsed_data.items():
        if field in date_fields and value is not None:
            parsed_data[field] = parse_date_string(value)
        elif isinstance(value, str):
            parsed_data[field] = value.lower()

    return parsed_data
