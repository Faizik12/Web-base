import React from 'react';
import CringeTable from './CringeTable';
import {
  Paper,
  Typography,
  Box,
  Grid,
} from '@mui/material';


interface DataItem {
  id: string;
  [key: string]: any;
};

interface ExamTablesProps {
  FTableData: DataItem[];
  STableData: DataItem[];
};

interface Person {
  id: string;
  firstName: string;
  secondName?: string;
  plannedDate: string;
};

const calculateDaysDiff = (targetDate: string): number => {
    // Получаем текущую дату
    const currentDate: Date = new Date();
    
    // Приводим переданную дату к объекту Date
    const target: Date = new Date(targetDate);
    
    // Проверяем валидность даты
    if (isNaN(target.getTime())) {
        throw new Error('Invalid date');
    }
    
    // Вычисляем разницу в миллисекундах
    const differenceInMs: number = target.getTime() - currentDate.getTime();
    // Конвертируем миллисекунды в дни (1000 мс * 60 сек * 60 мин * 24 часа)
    const differenceInDays: number = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
    
    console.log(Number(differenceInDays));
    return differenceInDays;
}

const ExamTables: React.FC<ExamTablesProps> = ({ FTableData, STableData }) => {
  const ebExam: Person[] = [];
  const otExam: Person[] = [];
  const heightWorkExam: Person[] = [];
  const retraining: Person[] = [];
  const pbInstruction: Person[] = [];
  const otTraining: Person[] = [];
  const inspection: Person[] = [];

  FTableData.map((user: DataItem) => {

    if (calculateDaysDiff(user.eb_exam_planned_date) <= 30) {
      console.log(calculateDaysDiff(user.eb_exam_actual_date));
      const dataUser = {
        id: user.id,
        firstName: user.first_name,
        secondName: user.last_name,
        plannedDate: user.eb_exam_planned_date,
      }
      ebExam.push(dataUser);
    }
    if (calculateDaysDiff(user.ot_exam_planned_date) <= 30) {
      const dataUser = {
        id: user.id,
        firstName: user.first_name,
        secondName: user.last_name,
        plannedDate: user.ot_exam_planned_date,
      }
      otExam.push(dataUser);
    }
    if (calculateDaysDiff(user.height_work_exam_planned_date) <= 30) {
      const dataUser = {
        id: user.id,
        firstName: user.first_name,
        secondName: user.last_name,
        plannedDate: user.height_work_exam_planned_date,
      }
      heightWorkExam.push(dataUser);
    }
    if (calculateDaysDiff(user.retraining_planned_date) <= 30) {
      const dataUser = {
        id: user.id,
        firstName: user.first_name,
        secondName: user.last_name,
        plannedDate: user.retraining_planned_date,
      }
      retraining.push(dataUser);
    }
    if (calculateDaysDiff(user.pb_instruction_planned_date) <= 30) {
      const dataUser = {
        id: user.id,
        firstName: user.first_name,
        secondName: user.last_name,
        plannedDate: user.pb_instruction_planned_date,
      }
      pbInstruction.push(dataUser);
    }
    if (calculateDaysDiff(user.ot_training_planned_date) <= 30) {
      const dataUser = {
        id: user.id,
        firstName: user.first_name,
        secondName: user.last_name,
        actualDate: user.ot_training_actual_date,
        plannedDate: user.ot_training_planned_date,
      }
      otTraining.push(dataUser);
    }
  });


  STableData.map((item: DataItem) => {

    if (calculateDaysDiff(item.inspection_planned_date) <= 30) {
      const dataItem = {
        id: item.id,
        firstName: item.name,
        plannedDate: item.inspection_planned_date,
      }
      inspection.push(dataItem);
    }
  });


  return (
    <Box sx={{ width: '100%', my: 4, padding: '20px', }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, }}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Экзамен по электробезопасности
            </Typography>
            <div>
              <CringeTable data={ebExam} />
            </div>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, }}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Экзамен по охране труда
            </Typography>
            <div>
              <CringeTable data={otExam} />
            </div>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, }}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Экзамен работ на высоте
            </Typography>
            <div>
              <CringeTable data={heightWorkExam} />
            </div>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, }}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Инструктаж
            </Typography>
            <div>
              <CringeTable data={retraining} />
            </div>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, }}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Инструктаж противопожарной безопасности
            </Typography>
            <div>
              <CringeTable data={pbInstruction} />
            </div>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, }}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Обучение по охране труда
            </Typography>
            <div>
              <CringeTable data={otTraining} />
            </div>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, }}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Проверка оборудования
            </Typography>
            <div>
              <CringeTable data={inspection} />
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExamTables;