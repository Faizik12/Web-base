import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom'; // Если используете React Router

interface HeaderProps {
  buttons?: {
    label: string;
    onClick?: () => void;
    href?: string; // Альтернатива onClick для навигации
  }[];
}

const Header: React.FC<HeaderProps> = ({ buttons = [] }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Button
          color="inherit"
          component={Link}
          to="/"
          startIcon={<HomeIcon />}
        >
          Домой
        </Button>

        {/* Гибкие кнопки, переданные через props */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
          {buttons.map((button, index) => (
            <Button
              key={index}
              color="inherit"
              onClick={button.onClick}
              {...(button.href && {
                component: Link,
                to: button.href,
              })}
            >
              {button.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;