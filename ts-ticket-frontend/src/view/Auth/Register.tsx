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

  // Error & Snackbar states
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
        minHeight: '90vh',
        flexDirection: { xs: 'column', md: 'row' },
        backgroundColor: '#ffffff',
      }}
    >
      {/* Left Side Image (hidden on mobile) */}
      <Box
        sx={{
          flexBasis: { md: '55%' },
          display: { xs: 'none', md: 'flex' },
          position: 'relative',
          overflow: 'hidden',
          padding: 2,
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Cinema seating"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '10px',
            objectPosition: 'center',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 40,
            left: 40,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '16px 24px',
            borderRadius: '8px',
            maxWidth: '70%',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#232323' }}>
            Join CineGold
          </Typography>
          <Typography variant="body1" sx={{ color: '#555555', mt: 1 }}>
            Create your account and enjoy our services
          </Typography>
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
          backgroundColor: '#ffffff',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 450 }}>
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                color: '#232323',
                mb: 1,
              }}
            >
              Create Account
            </Typography>
            <Typography variant="body1" sx={{ color: '#666666' }}>
              Start your movie journey with us
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            <TextField
              label="Name"
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              variant="outlined"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { borderColor: '#e0e0e0' },
                  '&:hover fieldset': { borderColor: '#bbbbbb' },
                  '&.Mui-focused fieldset': { borderColor: '#3f51b5' },
                },
              }}
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              variant="outlined"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { borderColor: '#e0e0e0' },
                  '&:hover fieldset': { borderColor: '#bbbbbb' },
                  '&.Mui-focused fieldset': { borderColor: '#3f51b5' },
                },
              }}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              variant="outlined"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { borderColor: '#e0e0e0' },
                  '&:hover fieldset': { borderColor: '#bbbbbb' },
                  '&.Mui-focused fieldset': { borderColor: '#3f51b5' },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: '8px',
                fontWeight: 600,
                backgroundColor: '#3f51b5',
                textTransform: 'none',
                fontSize: '1rem',
                boxShadow: '0 3px 5px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  backgroundColor: '#303f9f',
                  boxShadow: '0 5px 8px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              Sign Up
            </Button>
          </Box>

          {/* Responsive image for mobile */}
          <Box
            sx={{
              display: { xs: 'block', md: 'none' },
              mt: 6,
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Cinema seats"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Error Snackbar */}
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
