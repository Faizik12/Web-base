from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship

from backend.db import Base


class LogicalDataBase(Base):
    __tablename__ = 'logical_databases'

    name = Column(String(50), unique=True, nullable=False)
    description = Column(String(255), nullable=True)

    tables = relationship(
        'Table',
        back_populates='logical_database',
        cascade='all, delete'
    )

    def __repr__(self):
        return (
            f'<{self.__class__.__name__}('
            f'id={self.id}, ' # type: ignore
            f'name={self.name})>'
        )


class Table(Base):
    __tablename__ = 'tables'

    display_name = Column(String(50), nullable=False) # Выводимое имя
    physical_name = Column(String(50), unique=True, nullable=False) # Имя в БД
    description = Column(String(255), nullable=True)

    logical_database_id = Column(ForeignKey('logical_databases.id'), nullable=False)
    logical_database = relationship('LogicalDataBase', back_populates='tables')

    def __repr__(self):
        return (
            f'<{self.__class__.__name__}('
            f'id={self.id}, ' # type: ignore
            f'display_name={self.display_name}, '
            f'physical_name={self.physical_name})>'
        )
