import logging

from sqlalchemy.orm import load_only
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.inspection import inspect

from backend.db import db_session

logger = logging.getLogger(__name__)

def fetch_data(model, field_order, excluded_fields=None, format_rules=None, filters=None):
    if excluded_fields is None:
        excluded_fields = set()

    included_fields = [f for f in field_order if f not in excluded_fields]
    # Поменять included_fields на fields name, будем определять поля которые нужно вывести по объекту имен полей, все что в них нет будет являться полем не для пользлователя
    try:
        with db_session() as session:
            query = session.query(model).options(load_only(*included_fields))
            if filters is not None:
                query = query.filter_by(**filters) # type: ignore
            records = query.all() # type: ignore
            data = [row.to_dict(included_fields=included_fields, format_rules=format_rules) for row in records]
    except SQLAlchemyError:
        logger.exception(f'Ошибка при запросе к БД для модели {model.__name__}')
        raise
    except Exception:
        logger.exception(f'Ошибка при сериализации объекта модели {model.__name__}')
        raise

    return dict(data=data)

def fetch_data_with_field_names(model, field_order, field_names, excluded_fields=None, format_rules=None, filters=None):
    data = fetch_data(
        model=model,
        field_order=field_order,
        excluded_fields=excluded_fields,
        format_rules=format_rules,
        filters=filters
    )

    included_fields = [f for f in field_order if f not in excluded_fields]
    included_names = {field: field_names.get(field, field) for field in included_fields}

    data.update(field_names=included_names, field_order=field_order) # type: ignore надо сделать типизацию
    return data


def create_record(model, data, excluded_fields=None, format_rules=None):
    try:
        with db_session() as session:
            record = model(**data)
            session.add(record)
            session.commit()
            session.refresh(record)
            record_data = record.to_dict(format_rules=format_rules, excluded_fields=excluded_fields)
    except SQLAlchemyError:
        logger.exception(f'Ошибка при создании записи для модели {model.__name__}')
        raise

    except Exception:
        logger.exception(f'Ошибка при сериализации объекта модели {model.__name__}')
        raise

    return dict(data=record_data)

def full_update_record(model, id, data, excluded_fields=None, format_rules=None):
    # TODO: сделать возврат костомного исключения вместо None, оптимизировать работу с полями (id не должно изменяться, {immutable fields})
    try:
        with db_session() as session:
            record = session.query(model).get(id)
            if not record:
                return None

            for key, value in data.items():
                if key == 'id':
                    continue
                if hasattr(record, key):
                    setattr(record, key, value)

            session.commit()
            session.refresh(record)

            record_data = record.to_dict(format_rules=format_rules, excluded_fields=excluded_fields)

    except SQLAlchemyError:
        logger.exception(f'Ошибка при обеовлении записи модели {model.__name__}')
        raise

    except Exception:
        logger.exception(f'Ошибка при сериализации объекта модели {model.__name__}')
        raise

    return dict(data=record_data)

def delete_record_by_id(model, record_id):
    try:
        with db_session() as session:
            record = session.query(model).filter(model.id == record_id).one_or_none() # type: ignore
            if not record:
                return False
            session.delete(record)
            session.commit()
            return True
    except SQLAlchemyError:
        logger.exception(f'Ошибка при запросе к БД для модели {model.__name__}')
        raise
