from contextlib import contextmanager
import logging

from sqlalchemy import create_engine, Column, Integer, DateTime
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import func

from backend.config import Config

logger = logging.getLogger(__name__)


class BaseMixin:
    __abstract__ = True

    id = Column(Integer, primary_key=True, autoincrement=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(),
                        onupdate=func.now(), nullable=True)

    def to_dict(self, included_fields=None, excluded_fields=None, format_rules=None):
        if included_fields is None:
            included_fields = [c.name for c in self.__table__.columns] # type: ignore
        if excluded_fields is None:
            excluded_fields = set()
        if format_rules is None:
            format_rules = {}

        result = {}
        for field in included_fields:
            if field in excluded_fields:
                continue
            value = getattr(self, field)
            if field in format_rules:
                result[field] = format_rules[field](value)
            else:
                result[field] = value
        return result

    @classmethod
    def get_display_name(cls):
        return getattr(cls, '_display_name', 'Unknown')

Base = declarative_base(cls=BaseMixin)

_engine = None
_SessionLocal = None


def get_engine():
    global _engine
    if _engine is None:
        try:
            _engine = create_engine(
                Config.DATABASE_URL,
                pool_pre_ping=True,
                pool_recycle=3600,
                echo=False
            )
            logger.info('Engine базы данных успешно создан')
        except SQLAlchemyError:
            logger.exception('Ошибка при создании Engine')
            raise
    return _engine


def get_sessionmaker():
    global _SessionLocal
    if _SessionLocal is None:
        try:
            _SessionLocal = sessionmaker(
                autocommit=False,
                autoflush=False,
                bind=get_engine()
            )
            logger.info('SessionLocal успешно создан')
        except Exception:
            logger.exception('Ошибка при создании SessionLocal')
            raise
    return _SessionLocal


@contextmanager
def db_session():
    SessionLocal = get_sessionmaker()
    db = SessionLocal()
    logger.info('Создана новая сессия базы данных')
    try:
        yield db
    finally:
        db.close()
        logger.info('Сессия базы данных закрыта')
