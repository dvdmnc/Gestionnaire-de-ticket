import React, { useState } from 'react';
import { sendResetPassword } from '../../CRUD/AuthController';
import { TextField, Button, Snackbar, Alert, Box, Typography } from '@mui/material';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendResetPassword(email);
      setSnackbarMsg('Reset link sent! Check your email.');
    } catch (error: any) {
      setSnackbarMsg(error?.message || 'Failed to send reset link');
    } finally {
      setSnackbarOpen(true);
    }
  };

  return (
    <Box
      sx={{
        height: '91.47vh',
        background: 'linear-gradient(to right, rgb(8, 30, 63), rgb(0, 6, 34))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
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
          color: '#fff',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            fontFamily: 'Poppins, sans-serif',
            color: '#ffffff',
            mb: 1,
            textAlign: 'center',
          }}
        >
          Reset Password
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#c3d0ff',
            fontFamily: 'Montserrat, sans-serif',
            mb: 3,
            textAlign: 'center',
          }}
        >
          Enter your email and we’ll send you a reset link.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
        >
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            Send Reset Link
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="info" sx={{ width: '100%' }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ForgotPassword;
