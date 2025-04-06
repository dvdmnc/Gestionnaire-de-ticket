import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Snackbar, Alert } from '@mui/material';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://nwjetzftjnpmemcmlnyp.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53amV0emZ0am5wbWVtY21sbnlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MDI5MzUsImV4cCI6MjA1NTk3ODkzNX0._ItqMFvW6D93d7SFkoByJz-LZvubeMuv6I1O7TcF0xQ";

const supabase = createClient(supabaseUrl, supabaseKey);

const UpdatePassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setStatus(error.message);
      } else {
        setStatus('Password updated successfully!');
      }
    } catch (err: any) {
      setStatus(err?.message || 'Failed to update password');
    }
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

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
          color: '#fff'
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, fontFamily: 'Poppins, sans-serif', textAlign: 'center' }}>
          Set New Password
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: '#c3d0ff', fontFamily: 'Montserrat, sans-serif', textAlign: 'center' }}>
          Please enter your new password below.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
        >
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
            Update Password
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={status.includes('successfully') ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {status}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UpdatePassword;
