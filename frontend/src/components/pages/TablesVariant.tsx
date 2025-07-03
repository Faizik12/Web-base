import React, { useState, useEffect } from 'react';
import Header from '../layout/Header';
import Table from './Tables'
import ExamTables from '../table/CringeTables';

// Определяем типы для ответов API
type TablesData = {
  id: string | number;
  name: string;
  description: string;
};

interface DataItem {
  id: string;
  [key: string]: any;
}

interface TableApi {
  field_names: {
    [key: string]: string;
  };
  data: DataItem[];
};

const ApiDemoPage: React.FC = () => {
  // Состояние для каждого ответа API
  const [tables, setTables] = useState<TablesData[]>([]);
  const [firstTable, setFTable] = useState<DataItem[]>([]);
  const [secondTable, setSTable] = useState<DataItem[]>([]);
  const [render, setRender] = useState('FTable');
  
  // Состояния загрузки
  const [loadingTables, setLoadingTables] = useState<boolean>(false);
  const [loadingFTable, setLoadingFTable] = useState<boolean>(false);
  const [loadingSTable, setLoadingSTable] = useState<boolean>(false);
  
  // Состояния ошибок
  const [errorTables, setErrorTables] = useState<string | null>(null);
  const [errorFTable, setErrorFTable] = useState<string | null>(null);
  const [errorSTable, setErrorSTable] = useState<string | null>(null);

  // Запрос
  const fetchTables = async () => {
    setLoadingTables(true);
    setErrorTables(null);
    try {
      const response = await fetch('http://localhost:5000/api/databases/3');
      if (!response.ok) throw new Error('Ошибка загрузки списка таблиц');
      const data = await response.json();
      setTables(data);
    } catch (err) {
      setErrorTables(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoadingTables(false);
    }
  };

  // Запрос
  const fetchFTable = async () => {
    setLoadingFTable(true);
    setErrorFTable(null);
    try {
      const response = await fetch('http://localhost:5000/api/ot_records');
      if (!response.ok) throw new Error('Ошибка загрузки данных первой таблицы');
      const data = await response.json();
      setFTable(data.data);
    } catch (err) {
      setErrorFTable(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoadingFTable(false);
    }
  };

  // Запрос задач
  const fetchSTable = async () => {
    setLoadingSTable(true);
    setErrorSTable(null);
    try {
      const response = await fetch('http://localhost:5000/api/inspection_schedules');
      if (!response.ok) throw new Error('Ошибка загрузки задач');
      const data = await response.json();
      setSTable(data.data);
    } catch (err) {
      setErrorSTable(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoadingSTable(false);
    }
  };

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    fetchTables();
    fetchFTable();
    fetchSTable();
  }, []);

  // Функция для перезагрузки всех данных
  const refetchAll = () => {
    fetchTables();
    fetchFTable();
    fetchSTable();
  };

  const renderNeedTable = () => {
    if (render === 'summary') {
      return <ExamTables FTableData={firstTable} STableData={secondTable} />;
    }
    if (render === 'STable') {
      return <><Table isFirst={false} /><br /></>;
    }
    return <Table isFirst={true}/>;
  };

  const handleClick = (name: string) => {
    setRender(name);
  };

  const buttons = [
    {
      label: 'Первая таблица',
      onClick: () => handleClick('FTable')
    },
    {
      label: 'Вторая таблица',
      onClick: () => handleClick('STable')
    },
    {
      label: 'Контрольные даты',
      onClick: () => handleClick('summary')
    },
  ];

  return (
    <>
      <Header buttons={buttons}/>
      {renderNeedTable()}
    </>
  );
};

export default ApiDemoPage;