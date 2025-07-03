import logging

from backend.models import LogicalDataBase, Table
from backend.services.utils import fetch_data_with_field_names
from backend.constants.field_names import LOGICAL_DATABASE_FIELD_NAMES, TABLE_FIELD_NAMES
from backend.constants.field_order import LOGICAL_DATABASE_FIELD_ORDER, TABLE_FIELD_ORDER

logger = logging.getLogger(__name__)

def get_databases():
    excluded_fields = {'created_at', 'updated_at'}
    return fetch_data_with_field_names(
        model=LogicalDataBase,
        field_order=LOGICAL_DATABASE_FIELD_ORDER,
        field_names=LOGICAL_DATABASE_FIELD_NAMES,
        excluded_fields=excluded_fields
    )

def get_tables(logical_db_id):
    excluded_fields = {'created_at', 'updated_at'}
    return fetch_data_with_field_names(
        model=Table,
        field_order=TABLE_FIELD_ORDER,
        field_names=TABLE_FIELD_NAMES,
        excluded_fields=excluded_fields,
        filters={'logical_database_id': logical_db_id}
    )
