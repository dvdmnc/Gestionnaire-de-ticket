import React from 'react';
import { Box, Typography, Container, Grid, Paper } from '@mui/material';

const features = [
  { 
    title: 'Easy Booking', 
    description: 'Book your tickets in seconds with our intuitive interface and secure payment system.', 
    icon: '🎫', 
    color: '#4527a0',
    hoverColor: '#7c4dff'
  },
  { 
    title: 'Screening Management', 
    description: 'Browse movies, view showtimes, and manage your reservations all in one place.', 
    icon: '📅', 
    color: '#0277bd',
    hoverColor: '#039be5'
  },
  { 
    title: 'User Profiles', 
    description: 'Create your personalized profile for recommendations and manage your viewing history.', 
    icon: '👤', 
    color: '#00695c',
    hoverColor: '#00897b'
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <Box 
      sx={{ 
        py: { xs: 8, md: 12 }, 
        background: 'linear-gradient(180deg, #e3f2fd 0%, #ffffff 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background decorative element */}
      <Box 
        sx={{ 
          position: 'absolute',
          top: 0,
          right: 0,
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(25,118,210,0.1) 0%, rgba(25,118,210,0) 70%)',
          borderRadius: '50%',
          transform: 'translate(30%, -30%)',
        }}
      />
      
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            textAlign: 'center', 
            mb: { xs: 6, md: 8 } 
          }}
        >
          <Typography 
            variant="overline" 
            sx={{ 
              color: '#1976d2', 
              fontWeight: 600,
              letterSpacing: 2,
              mb: 1,
              display: 'block'
            }}
          >
            WHY CHOOSE US
          </Typography>
          
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              mb: 2, 
              fontWeight: 700,
              background: 'linear-gradient(90deg, #0d47a1 0%, #1976d2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Our Premium Features
          </Typography>
          
          <Typography 
            variant="body1" 
            color="textSecondary" 
            sx={{ 
              maxWidth: '700px', 
              mx: 'auto',
              fontSize: '1.1rem',
              lineHeight: 1.7
            }}
          >
            Discover the tools that make CineManage the perfect platform for your cinema experience.
            Each feature is designed with your convenience in mind.
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  height: '100%',
                  borderRadius: '16px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                    '& .feature-icon-bg': {
                      backgroundColor: feature.hoverColor,
                    }
                  }
                }}
              >
                {/* Icon background */}
                <Box 
                  className="feature-icon-bg"
                  sx={{ 
                    width: '80px',
                    height: '80px',
                    backgroundColor: feature.color,
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                    transition: 'all 0.3s ease',
                    fontSize: '2rem'
                  }}
                >
                  <Typography variant="h3">{feature.icon}</Typography>
                </Box>
                
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 2, 
                    fontWeight: 600,
                    color: '#0d47a1'
                  }}
                >
                  {feature.title}
                </Typography>
                
                <Typography 
                  variant="body1" 
                  color="textSecondary"
                  sx={{ lineHeight: 1.7 }}
                >
                  {feature.description}
                </Typography>
                
                {/* Decorative corner element */}
                <Box 
                  sx={{ 
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '80px',
                    height: '80px',
                    background: `linear-gradient(135deg, transparent 50%, ${feature.color}22 50%)`,
                  }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;