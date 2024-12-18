import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Home, AddCircle, Logout } from '@mui/icons-material';


const Layout = ({ children }) => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
              QuoteApp
            </Link>
          </Typography>
          {token && (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/"
                startIcon={<Home />}
                sx={{ mr: 1 }}
              >
                Home
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/create"
                startIcon={<AddCircle />}
                sx={{ mr: 1 }}
              >
                Create Quote
              </Button>
              <Button
                color="inherit"
                onClick={handleLogout}
                startIcon={<Logout />}
              >
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;

