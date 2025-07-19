from sqlalchemy import Column, String, Integer, SmallInteger, Date, Boolean, CheckConstraint

from backend.db import Base

class OTRecord(Base):
    __tablename__ = 'ot_records'
    _display_name = 'Учет ОТ'

    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    middle_name = Column(String(50), nullable=False)
    position = Column(String(50), nullable=False)
    eb_group = Column(SmallInteger, nullable=False)
    employment_start_date = Column(Date, nullable=False)
    is_engineer = Column(Boolean, nullable=False)
    is_worker = Column(Boolean, nullable=False)

    eb_exam_previous_date = Column(Date, nullable=False)
    eb_exam_planned_date = Column(Date, nullable=False)
    eb_exam_actual_date = Column(Date, nullable=False)

    ot_exam_previous_date = Column(Date, nullable=False)
    ot_exam_planned_date = Column(Date, nullable=False)
    ot_exam_actual_date = Column(Date, nullable=False)

    height_work_exam_previous_date = Column(Date, nullable=True)
    height_work_exam_planned_date = Column(Date, nullable=True)
    height_work_exam_actual_date = Column(Date, nullable=True)

    retraining_planned_date = Column(Date, nullable=True)
    retraining_actual_date = Column(Date, nullable=True)

    pb_instruction_planned_date = Column(Date, nullable=False)
    pb_instruction_actual_date = Column(Date, nullable=False)

    ot_training_actual_date = Column(Date, nullable=True)
    ot_training_planned_date = Column(Date, nullable=True)

    __table_args__ = (
        CheckConstraint('CAST(is_engineer AS INTEGER) + CAST(is_worker AS INTEGER) = 1', name='chk_exclusive_role'),
    )

    def __repr__(self):
        return (
            f'<{self.__class__.__name__}('
            f'id={self.id}, ' # type: ignore
            f'first_name={self.first_name}, '
            f'last_name={self.last_name}, '
            f'middle_name={self.middle_name})>'
        )


class InspectionSchedule(Base):
    __tablename__ = 'inspection_schedules'
    _display_name = 'График проверок'

    name = Column(String(100), nullable=False)
    inspection_planned_date = Column(Date, nullable=False)
    inspection_actual_date = Column(Date, nullable=True)

    def __repr__(self):
        return (
            f'<{self.__class__.__name__}('
            f'id={self.id}, ' # type: ignore
            f'name={self.name})>'
        )
