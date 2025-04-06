import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Snackbar,
} from '@mui/material';
import { registerUser } from '../../CRUD/AuthController';

const Register: React.FC = () => {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(nom, email, password);
      navigate('/login');
    } catch (err) {
      console.error('Registration failed', err);
      if (axios.isAxiosError(err)) {
        if (err.response?.data && typeof err.response.data === 'object' && 'error' in err.response.data) {
          setError(err.response.data.error as string);
        } else {
          setError('Error registering account');
        }
      } else if (err instanceof Error) {
        setError(err.message || 'An unexpected error occurred');
      } else {
        setError('An unknown error occurred');
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
        color: '#fff',
      }}
    >
      {/* Left Side Image */}
      <Box
        sx={{
          flexBasis: { md: '55%' },
          display: { xs: 'none', md: 'flex' },
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            borderRadius: 4,
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 0 20px rgba(0,0,0,0.4)',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Cinema seating"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
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
              maxWidth: '70%',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#fff' }}>
              Join CineGold
            </Typography>
            <Typography variant="body2" sx={{ color: '#ccc', mt: 1 }}>
              Create your account and enjoy our services
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Right Side Form */}
      <Box
        sx={{
          flexBasis: { md: '45%' },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 420,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            p: 4,
            borderRadius: 3,
            boxShadow: '0 0 20px rgba(0,0,0,0.3)',
          }}
        >
          <Box sx={{ mb: 5, textAlign: 'center' }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontFamily: 'Poppins, sans-serif',
                color: '#ffffff',
                mb: 1,
              }}
            >
              Create Account
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#c3d0ff', fontFamily: 'Montserrat, sans-serif' }}
            >
              Start your movie journey with us
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
          >
            <TextField
              label="Name"
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              fullWidth
              variant="outlined"
              InputLabelProps={{ style: { color: '#c3d0ff' } }}
              InputProps={{ style: { color: '#fff' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': {
                    borderColor: '#3a4d75',
                  },
                  '&:hover fieldset': {
                    borderColor: '#637ccd',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#81a4ff',
                  },
                },
              }}
            />
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
                    borderColor: '#3a4d75',
                  },
                  '&:hover fieldset': {
                    borderColor: '#637ccd',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#81a4ff',
                  },
                },
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
                    borderColor: '#3a4d75',
                  },
                  '&:hover fieldset': {
                    borderColor: '#637ccd',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#81a4ff',
                  },
                },
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
                  backgroundColor: '#1565c0',
                },
              }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Register;
