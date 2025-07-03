import React, { useState, useEffect } from 'react';
import DynamicTable from '../table/Table';
import { 
  Button, 
  CircularProgress, 
  Snackbar, 
  Alert,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText
} from '@mui/material';
import axios from 'axios';

interface DataItem {
  id: number;
  [key: string]: any;
}

interface ApiResponse {
  field_names: {
    [key: string]: string;
  };
  data: DataItem[];
}

interface ColumnConfig {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  editable?: boolean;
  renderCell?: (row: DataItem) => React.ReactNode;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}

interface Props {
  isFirst: boolean;
}

const ServerConnectedTable: React.FC<Props> = ({ isFirst }) => {
  const [data, setData] = useState<DataItem[]>([]);
  const [columns, setColumns] = useState<ColumnConfig[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success'
  });
  const check = isFirst ? 'ot_records' : 'inspection_schedules';
  
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {},
    onCancel: () => {}
  });

  const openConfirmDialog = (title: string, message: string, onConfirm: () => void) => {
    setConfirmDialog({
      open: true,
      title,
      message,
      onConfirm,
      onCancel: () => setConfirmDialog(prev => ({...prev, open: false}))
    });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Получаем данные с сервера
      const response = await axios.get<ApiResponse>(`http://localhost:5000/api/${check}`);
      
      // Форматируем колонки на основе field_names из ответа
      const formattedColumns = Object.entries(response.data.field_names).map(
        ([fieldId, label]) => ({
          id: fieldId,
          label,
          minWidth: 100,
          align: 'left' as const,
          editable: fieldId !== 'id' // Запрещаем редактирование id
        })
      );
      
      setColumns(formattedColumns);
      setData(response.data.data);
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(errorMessage);
      setLoading(false);
      showSnackbar('Ошибка при загрузке данных', 'error');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = async (id: number | string, field: string, value: any) => {
    openConfirmDialog(
      'Подтверждение изменений',
      'Вы уверены, что хотите сохранить изменения?',
      async () => {
        try {
          // Отправляем PATCH запрос на сервер
          await axios.patch(`/api/${check}/${id}`, {
            [field]: value
          });
          
          // Обновляем локальное состояние
          setData(prevData =>
            prevData.map(item =>
              item.id === id ? { ...item, [field]: value } : item
            )
          );
          
          showSnackbar('Изменения сохранены', 'success');
        } catch (err) {
          showSnackbar('Ошибка при сохранении изменений', 'error');
          // Если ошибка - перезагружаем данные с сервера
          fetchData();
        } finally {
          setConfirmDialog(prev => ({...prev, open: false}));
        }
      }
    );
  };

  const handleDelete = async (id: number | string) => {
    openConfirmDialog(
      'Подтверждение удаления',
      'Вы уверены, что хотите удалить эту запись?',
      async () => {
        try {
          // Отправляем DELETE запрос на сервер
          await axios.delete(`/api/${check}/${id}`);
          
          // Обновляем локальное состояние
          setData(prevData => prevData.filter(item => item.id !== id));
          showSnackbar('Элемент удален', 'success');
        } catch (err) {
          showSnackbar('Ошибка при удалении элемента', 'error');
          // Если ошибка - перезагружаем данные с сервера
          fetchData();
        } finally {
          setConfirmDialog(prev => ({...prev, open: false}));
        }
      }
    );
  };

/*  const handleAdd = async () => {
    try {
      // Базовые данные для нового элемента
      const newItem = {
        name: 'Новый элемент',
        description: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Отправляем POST запрос на сервер
      const response = await axios.post<DataItem>(`/items`, newItem);
      
      // Обновляем локальное состояние
      setData(prevData => [...prevData, response.data]);
      showSnackbar('Элемент добавлен', 'success');
    } catch (err) {
      showSnackbar('Ошибка при добавлении элемента', 'error');
    }
  };
*/

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading && data.length === 0) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
      <CircularProgress />
    </div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>
      Ошибка: {error}
      <Button onClick={fetchData} variant="outlined" style={{ marginLeft: '10px' }}>
        Повторить
      </Button>
    </div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Таблица с синхронизацией с сервером</h1>
      
      <div style={{ marginBottom: '20px' }}>
        
        <Button 
          variant="outlined" 
          onClick={fetchData}
          disabled={loading}
          style={{ marginLeft: '10px' }}
        >
          Обновить данные
        </Button>
      </div>
      
      <DynamicTable
        data={data}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        idField="id"
        pagination={true}
      />
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={confirmDialog.open}
        onClose={confirmDialog.onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {confirmDialog.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {confirmDialog.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={confirmDialog.onCancel}>Отмена</Button>
          <Button 
            onClick={confirmDialog.onConfirm} 
            autoFocus
            color="primary"
          >
            Подтвердить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ServerConnectedTable;