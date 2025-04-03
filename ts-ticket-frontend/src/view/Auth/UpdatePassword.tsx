import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Snackbar, Alert } from '@mui/material';
import { createClient } from '@supabase/supabase-js'

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
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
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

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: 'auto',
        mt: 4,
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: '#ffffff'
      }}
    >
      <Typography variant="h5" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
        Set a New Password
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        Please enter your new password below.
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <TextField
          label="New Password"
          type="password"
          variant="outlined"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
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
              boxShadow: '0 5px 8px rgba(0, 0, 0, 0.2)'
            }
          }}
        >
          Update Password
        </Button>
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
