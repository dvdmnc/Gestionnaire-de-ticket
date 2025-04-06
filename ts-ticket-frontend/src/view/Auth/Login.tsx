import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Snackbar
} from '@mui/material';
import { loginUser } from '../../CRUD/AuthController';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      if (data.isAdmin) {
        navigate('/admin/films');
      } else {
        navigate('/client/home');
      }
    } catch (error) {
      console.error('Login failed', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError('Email ou mot de passe incorrect');
        } else if (
          error.response?.data &&
          typeof error.response.data === 'object' &&
          'message' in error.response.data
        ) {
          setError(error.response.data.message as string);
        } else {
          setError('Erreur lors de la connexion');
        }
      } else if (error instanceof Error) {
        setError(error.message || 'Une erreur est survenue lors de la connexion');
      } else {
        setError('Une erreur inattendue est survenue');
      }
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '91.47vh',
        overflow: 'hidden',
        flexDirection: { xs: 'column', md: 'row' },
        background: 'linear-gradient(to right, rgb(8, 30, 63), rgb(0, 6, 34))',
        color: '#fff'
      }}
    >
      {/* Image Side */}
      <Box
        sx={{
          flexBasis: { md: '55%' },
          display: { xs: 'none', md: 'flex' },
          justifyContent: 'center',
          alignItems: 'center',
          p: 3
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            borderRadius: 4,
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 0 20px rgba(0,0,0,0.4)'
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Cinema theater"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 30,
              left: 30,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              padding: '16px 24px',
              borderRadius: '8px',
              maxWidth: '70%'
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#fff' }}>
              CineGold
            </Typography>
            <Typography variant="body2" sx={{ color: '#ccc', mt: 1 }}>
              Your gateway to the world of cinema.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Form Side */}
      <Box
        sx={{
          flexBasis: { md: '45%' },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: { xs: 3, sm: 6 }
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 420,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            p: 4,
            borderRadius: 3,
            boxShadow: '0 0 20px rgba(0,0,0,0.3)'
          }}
        >
          <Box sx={{ mb: 5, textAlign: 'center' }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontFamily: 'Poppins, sans-serif',
                color: '#ffffff',
                mb: 1
              }}
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#c3d0ff', fontFamily: 'Montserrat, sans-serif' }}
            >
              Sign in to continue
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
          >
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              variant="outlined"
              InputLabelProps={{ style: { color: '#c3d0ff' } }}
              InputProps={{ style: { color: '#fff' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': {
                    borderColor: '#3a4d75'
                  },
                  '&:hover fieldset': {
                    borderColor: '#637ccd'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#81a4ff'
                  }
                }
              }}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              variant="outlined"
              InputLabelProps={{ style: { color: '#c3d0ff' } }}
              InputProps={{ style: { color: '#fff' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': {
                    borderColor: '#3a4d75'
                  },
                  '&:hover fieldset': {
                    borderColor: '#637ccd'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#81a4ff'
                  }
                }
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                py: 1.4,
                borderRadius: '8px',
                fontWeight: 600,
                backgroundColor: '#1976d2',
                textTransform: 'none',
                fontSize: '1rem',
                fontFamily: 'Montserrat, sans-serif',
                '&:hover': {
                  backgroundColor: '#1565c0'
                }
              }}
            >
              Sign In
            </Button>
            <Typography
              variant="body2"
              align="center"
              sx={{
                color: '#c3d0ff',
                fontFamily: 'Montserrat, sans-serif',
                mt: 1
              }}
            >
              Having trouble?{' '}
              <span
                style={{ color: '#81a4ff', cursor: 'pointer' }}
                onClick={() => navigate('/reset-password')}
              >
                Reset Password
              </span>
            </Typography>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
