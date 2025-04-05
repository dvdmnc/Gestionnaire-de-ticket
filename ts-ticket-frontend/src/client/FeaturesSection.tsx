import React from 'react';
import { Box, Typography, Container, Grid, Paper } from '@mui/material';

const features = [
  { title: 'Easy Booking', description: 'Book your tickets with a few clicks.', icon: '🎫' },
  { title: 'Screening Management', description: 'View and manage screening schedules effortlessly.', icon: '📅' },
  { title: 'User Accounts', description: 'Create and manage your profile easily.', icon: '👤' },
];

const FeaturesSection: React.FC = () => {
  return (
    <Box sx={{ py: 8, backgroundColor: '#e3f2fd' }}>
      <Container>
        <Typography variant="h4" component="h2" align="center" sx={{ mb: 4, fontWeight: 600 }}>
          Our Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h3">{feature.icon}</Typography>
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
