import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Snackbar,
} from '@mui/material';

const Contact: React.FC = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // e.g.: await axios.post('/api/contact', { name, email, message });
      
      setSuccess('Your message has been sent successfully!');
      setError(null);
    } catch (err) {
      console.error('Contact form submission failed', err);
      if (axios.isAxiosError(err)) {
        setError('Something went wrong while sending your message');
      } else {
        setError('An unexpected error occurred.');
      }
    }

    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setError(null);
    setSuccess(null);
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
          src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Contact illustration"
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
            Contact CineGold
          </Typography>
          <Typography variant="body1" sx={{ color: '#555555', mt: 1 }}>
            We would love to hear from you!
          </Typography>
        </Box>
      </Box>

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
              Get In Touch
            </Typography>
            <Typography variant="body1" sx={{ color: '#666666' }}>
              We'd love to hear your feedback or answer your questions
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
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              label="Message"
              multiline
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
              Send Message
            </Button>
            <Typography variant="body2" align="center" sx={{ color: '#666666', mt: 2 }}>
              Prefer a call? Reach us at +33 4 94 56 73 12
            </Typography>
          </Box>

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
              src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Contact illustration"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </Box>
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
          severity={error ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contact;
