import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
} from '@mui/material';

interface Person {
  id: string;
  firstName: string;
  secondName?: string;
  plannedDate: Date | string;
}

interface TableProps {
  data: Person[];
}

const DateTable: React.FC<TableProps> = ({ data }) => {
  const [orderBy, setOrderBy] = useState<keyof Person>('firstName');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [hasSecondNames, setHasSecondNames] = useState(false);

  // Обновляем проверку наличия фамилий при изменении данных
  useEffect(() => {
    setHasSecondNames(data.some(item => item.secondName !== undefined && item.secondName !== ''));
  }, [data]);

  const handleSort = (property: keyof Person) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const parseDate = (date: Date | string): Date => {
    return date instanceof Date ? date : new Date(date);
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];

    if (aValue === undefined || bValue === undefined) {
      if (aValue === undefined && bValue === undefined) return 0;
      return aValue === undefined ? 1 : -1;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return order === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }

    if (orderBy === 'plannedDate') {
      const aDate = parseDate(aValue);
      const bDate = parseDate(bValue);
      return order === 'asc' 
        ? aDate.getTime() - bDate.getTime() 
        : bDate.getTime() - aDate.getTime();
    }

    return 0;
  });

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'firstName'}
                direction={orderBy === 'firstName' ? order : 'asc'}
                onClick={() => handleSort('firstName')}
              >
                Имя
              </TableSortLabel>
            </TableCell>
            {hasSecondNames && (
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'secondName'}
                  direction={orderBy === 'secondName' ? order : 'asc'}
                  onClick={() => handleSort('secondName')}
                >
                  Фамилия
                </TableSortLabel>
              </TableCell>
            )}
            <TableCell>
              <TableSortLabel
                active={orderBy === 'plannedDate'}
                direction={orderBy === 'plannedDate' ? order : 'asc'}
                onClick={() => handleSort('plannedDate')}
              >
                Планированная дата
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.firstName}</TableCell>
              {hasSecondNames && (
                <TableCell>{item.secondName}</TableCell>
              )}
              <TableCell>
                {parseDate(item.plannedDate).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DateTable;