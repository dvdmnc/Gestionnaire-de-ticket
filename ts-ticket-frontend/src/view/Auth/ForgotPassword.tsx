import React, { useState } from 'react';
import { sendResetPassword } from '../../CRUD/AuthController'; // We'll define this function
import { TextField, Button, Snackbar, Alert } from '@mui/material';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendResetPassword(email);
      setSnackbarMsg('Reset link sent! Check your email.');
      setSnackbarOpen(true);
    } catch (error: any) {
      setSnackbarMsg(error?.message || 'Failed to send reset link');
      setSnackbarOpen(true);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Reset Password</h2>
      <p>Enter your email and we'll send you a reset link.</p>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: '16px' }}
        />
        <Button type="submit" variant="contained" fullWidth>
          Send Reset Link
        </Button>
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="info">
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ForgotPassword;
