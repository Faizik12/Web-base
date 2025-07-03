import React, { memo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  TablePagination,
  Box,
  CircularProgress,
} from '@mui/material';
import { Edit, Delete, Save, Cancel } from '@mui/icons-material';

interface DynamicTableProps {
  data: Record<string, any>[];
  columns: {
    id: string;
    label: string;
    minWidth?: number;
    align?: 'right' | 'left' | 'center';
    editable?: boolean;
    format?: (value: any) => React.ReactNode;
  }[];
  loading?: boolean;
  onEdit?: (id: string | number, field: string, value: any) => void;
  onDelete?: (id: string | number) => void;
  idField?: string;
  pagination?: boolean;
}

const DynamicTable = ({
  data = [],
  columns = [],
  loading = false,
  onEdit,
  onDelete,
  idField = 'id',
  pagination = true
}: DynamicTableProps) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [editingId, setEditingId] = React.useState<string | number | null>(null);
  const [editData, setEditData] = React.useState<Record<string, any> | null>(null);

  // Обработчики изменений (остаются без изменений)
  const handleEditClick = (row: Record<string, any>) => {
    setEditingId(row[idField]);
    setEditData({ ...row });
  };

  const handleSave = () => {
    if (editingId && editData && onEdit) {
      Object.keys(editData).forEach(key => {
        if (key !== idField && editData[key] !== data.find(item => item[idField] === editingId)?.[key]) {
          onEdit(editingId, key, editData[key]);
        }
      });
    }
    setEditingId(null);
    setEditData(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData(null);
  };

  const handleChange = (field: string, value: any) => {
    setEditData(prev => prev ? { ...prev, [field]: value } : null);
  };

  // Рендер ячейки с учетом форматирования
  const renderCellContent = (row: Record<string, any>, column: any) => {
    const value = row[column.id];
    
    if (column.format) {
      return column.format(value);
    }
    
    if (typeof value === 'boolean') {
      return value ? '✓' : '✗';
    }
    
    return value;
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader aria-label="dynamic table">
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
              {(onEdit || onDelete) && <TableCell align="right">Действия</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1}>
                  <Box display="flex" justifyContent="center" p={2}>
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              (pagination ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : data)
                .map(row => {
                  const isEditing = editingId === row[idField];
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row[idField]}>
                      {columns.map(column => (
                        <TableCell key={`${row[idField]}-${column.id}`} align={column.align}>
                          {isEditing && column.editable !== false ? (
                            <TextField
                              value={editData?.[column.id] || ''}
                              onChange={e => handleChange(column.id, e.target.value)}
                              size="small"
                              fullWidth
                            />
                          ) : (
                            renderCellContent(row, column)
                          )}
                        </TableCell>
                      ))}
                      {(onEdit || onDelete) && (
                        <TableCell align="right">
                          {isEditing ? (
                            <>
                              <IconButton onClick={handleSave} size="small">
                                <Save fontSize="small" />
                              </IconButton>
                              <IconButton onClick={handleCancel} size="small">
                                <Cancel fontSize="small" />
                              </IconButton>
                            </>
                          ) : (
                            <>
                              {onEdit && (
                                <IconButton onClick={() => handleEditClick(row)} size="small">
                                  <Edit fontSize="small" />
                                </IconButton>
                              )}
                              {onDelete && (
                                <IconButton onClick={() => onDelete(row[idField])} size="small">
                                  <Delete fontSize="small" />
                                </IconButton>
                              )}
                            </>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={e => {
            setRowsPerPage(+e.target.value);
            setPage(0);
          }}
        />
      )}
    </Paper>
  );
};

export default memo(DynamicTable);