import logging

from backend.services.utils import fetch_data_with_field_names, delete_record_by_id, create_record
from backend.models import OTRecord, InspectionSchedule
from backend.constants.field_names import OT_RECORD_FIELD_NAMES, INSPECTION_SCHEDULE_FIELD_NAMES
from backend.constants.field_order import OT_RECORD_FIELD_ORDER, INSPECTION_SCHEDULE_FIELD_ORDER
from backend.db import db_session
from backend.serializers import FormatRulesBuilder

logger = logging.getLogger(__name__)

def get_ot_records():
    excluded_fields = {'created_at', 'updated_at'}

    format_rules = FormatRulesBuilder().with_defaults().build()

    return fetch_data_with_field_names(
        model=OTRecord,
        field_order=OT_RECORD_FIELD_ORDER,
        field_names=OT_RECORD_FIELD_NAMES,
        excluded_fields=excluded_fields,
        format_rules=format_rules
    )

def create_ot_record(data):
    excluded_fields = {'created_at', 'updated_at'}

    format_rules = FormatRulesBuilder().with_defaults().build()

    result = create_record(model=OTRecord,
                           data=data,
                           excluded_fields=excluded_fields,
                           format_rules=format_rules)

    return result

def delete_ot_record(id):
    return delete_record_by_id(model=OTRecord, record_id=id)

    return result

def get_inspection_schedules():
    excluded_fields = {'created_at', 'updated_at'}

    format_rules = FormatRulesBuilder().with_defaults().build()

    return fetch_data_with_field_names(
        model=InspectionSchedule,
        field_order=INSPECTION_SCHEDULE_FIELD_ORDER,
        field_names=INSPECTION_SCHEDULE_FIELD_NAMES,
        excluded_fields=excluded_fields,
        format_rules=format_rules
    )

def create_inspection_schedule(data):
    excluded_fields = {'created_at', 'updated_at'}

    format_rules = FormatRulesBuilder().with_defaults().build()

    result = create_record(model=InspectionSchedule,
                           data=data,
                           excluded_fields=excluded_fields,
                           format_rules=format_rules)
    return result

def delete_inspection_schedule(id):
    return delete_record_by_id(model=InspectionSchedule, record_id=id)
