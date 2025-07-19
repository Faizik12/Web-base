import React, { useState, useEffect } from 'react';
import { Grid, Container, CircularProgress, Typography } from '@mui/material';
import ListItem from './ListItem';

interface ItemData {
  id: string | number;
  name: string;
  description: string;
}

const ListPage: React.FC = () => {
  const [items, setItems] = useState<ItemData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Замените на ваш реальный API endpoint
        const response = await fetch('/api/databases');
        if (!response.ok) {
          throw new Error('Ошибка загрузки данных');
        }
        const data = await response.json();
        setItems(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Список баз данных
      </Typography>
      
      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid 
            key={item.id} 
            size={{xs: 12, sm: 6, md: 4, lg: 3}}
          >
            <ListItem
              id={`${item.id}`}
              name={item.name}
              description={item.description}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ListPage;