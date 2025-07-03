import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

interface ListItemProps {
  id: string;
  name: string;
  description: string;
}

const ListItem: React.FC<ListItemProps> = ({ id, name, description}) => {
  return (
    <Card sx={{ mb: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
      </CardContent>
      <Box sx={{ p: 2 }}>
        <Button 
          component={Link} 
          to={`/databases/${id}`} 
          variant="contained" 
          fullWidth
          size="small"
        >
          Перейти
        </Button>
      </Box>
    </Card>
  );
};

export default ListItem;