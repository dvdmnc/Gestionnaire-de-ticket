import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';

const HeroSection: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: '#0d47a1', color: '#fff', py: 10 }}>
      <Container>
        <Typography variant="h2" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          Welcome to CineManage
        </Typography>
        <Typography variant="h5" sx={{ mb: 4 }}>
          Book your movies, manage screenings, and enjoy an unbeatable cinema experience.
        </Typography>
        <Button variant="contained" size="large" sx={{ backgroundColor: '#1976d2' }}>
          Get Started
        </Button>
      </Container>
    </Box>
  );
};

export default HeroSection;
