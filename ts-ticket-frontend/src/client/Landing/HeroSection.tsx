import React from 'react';
import { Box, Typography, Button, Container, Stack } from '@mui/material';

const HeroSection: React.FC = () => {
  return (
    <Box 
      sx={{ 
        background: 'linear-gradient(to right,rgb(8, 30, 63) 0%,rgb(0, 6, 34) 100%)',

        color: '#fff', 
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {/* Simple gradient background element */}
      <Box 
        sx={{ 
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 204, 255, 0.2) 0%, rgba(0,229,255,0) 70%)',
          filter: 'blur(60px)',
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6
        }}>
          <Box 
            sx={{ 
              width: { xs: '100%', md: '50%' },
              pr: { md: 4 }
            }}
          >
            <Box 
              component="span" 
              sx={{ 
                display: 'inline-block',
                backgroundColor: 'rgba(0, 229, 255, 0.15)',
                color: '#00e5ff',
                px: 2,
                py: 0.5,
                borderRadius: 2,
                fontSize: '0.875rem',
                fontWeight: 500,
                mb: 2,
                letterSpacing: 1,
                textTransform: 'uppercase',
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              Premium Cinema Experience
            </Box>
            
            <Typography 
              variant="h1" 
              component="h1" 
              sx={{ 
                fontWeight: 700, 
                mb: 3,
                fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem', lg: '4rem' },
                lineHeight: 1.2,
                fontFamily: 'Montserrat, sans-serif',
                color: '#ffffff'
              }}
            >
              Welcome to <Box component="span" sx={{ color: '#00e5ff', display: 'inline-block' }}>CineGold</Box>
            </Typography>
            
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 5, 
                fontWeight: 300,
                maxWidth: '600px',
                lineHeight: 1.6,
                fontSize: { xs: '1rem', sm: '1.1rem' },
                opacity: 0.9,
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              Immerse yourself in cinema magic with our seamless booking platform — where technology meets comfort.
            </Typography>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <Button
                variant="contained"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: '6px',
                  background: '#00e5ff',
                  color: '#051937',
                  fontWeight: 600,
                  fontFamily: 'Poppins, sans-serif',
                  boxShadow: 'none',
                  '&:hover': {
                    background: '#00c4d8',
                    boxShadow: 'none'
                  }
                }}
              >
                Book Now
              </Button>

              <Button
                variant="outlined"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: '6px',
                  borderColor: '#00e5ff',
                  color: '#00e5ff',
                  fontWeight: 500,
                  fontFamily: 'Poppins, sans-serif',
                  '&:hover': {
                    borderColor: '#ffffff',
                    color: '#ffffff',
                    background: 'transparent'
                  }
                }}
              >
                Explore Movies
              </Button>
            </Stack>
            
            {/* Simple metrics */}
            <Stack 
              direction="row" 
              spacing={4} 
              sx={{ 
                mt: 6,
                display: { xs: 'none', md: 'flex' } 
              }}
            >
              {[
                { label: 'Premium Theaters', value: '12+' },
                { label: 'Movies Available', value: '50+' },
                { label: 'Happy Customers', value: '15K+' }
              ].map((item, index) => (
                <Box key={index} sx={{ textAlign: 'center' }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#00e5ff',
                      mb: 1,
                      fontFamily: 'Montserrat, sans-serif'
                    }}
                  >
                    {item.value}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      opacity: 0.7,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      fontSize: '0.75rem',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
          
          <Box 
            sx={{ 
              width: { xs: '100%', md: '50%' },
              position: 'relative',
              display: { xs: 'none', sm: 'block' },
              height: { md: '450px' }
            }}
          >
            {/* Clean and minimalist main image */}
            <Box 
              component="img"
              src="https://images.unsplash.com/photo-1640127249308-098702574176?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '100%',
                objectFit: 'cover',
                borderRadius: '8px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                transition: 'all 0.4s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.4)'
                }
              }}
            />
              {/* Floating ticket */}
              <Box 
              sx={{
                position: 'absolute',
                bottom: '10%',
                left: '-10%',
                width: '150px',
                height: '80px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '12px',
                transform: 'rotate(-10deg)',
                animation: 'float2 5s ease-in-out infinite',
                '@keyframes float2': {
                  '0%': {
                    transform: 'rotate(-10deg) translateY(0)'
                  },
                  '50%': {
                    transform: 'rotate(-8deg) translateY(-10px)'
                  },
                  '100%': {
                    transform: 'rotate(-10deg) translateY(0)'
                  }
                },
                zIndex: 3,
              }}
            >
              <Box 
                sx={{ 
                  width: '100%', 
                  height: '100%',
                  background: 'linear-gradient(45deg, #ff8a00, #e52e71)',
                  borderRadius: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#fff'
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 700 }}>VIP TICKET</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>SEAT A1</Typography>
              </Box>
            </Box>
            
            {/* Floating popcorn */}
            <Box 
              sx={{
                position: 'absolute',
                top: '1%',
                right: '-5%',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                animation: 'float3 7s ease-in-out infinite',
                '@keyframes float3': {
                  '0%': {
                    transform: 'rotate(5deg) translateY(0)'
                   },
                  '50%': {
                    transform: 'rotate(10deg) translateY(-15px)'
                  },
                  '100%': {
                    transform: 'rotate(5deg) translateY(0)'
                  }
                },
                zIndex: 3,
                backgroundColor: '#fff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '3rem'
              }}
            >
              🍿
            </Box>
            
            {/* Decorative elements */}
            <Box 
              sx={{ 
                position: 'absolute',
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(0,229,255,0.4) 0%, rgba(0,229,255,0) 70%)',
                borderRadius: '50%',
                bottom: '-60px',
                left: '-60px',
                filter: 'blur(30px)',
                zIndex: 1
              }}
            />
            {/* Simple decorative element */}
            <Box 
              sx={{ 
                position: 'absolute',
                width: '150px',
                height: '150px',
                background: 'radial-gradient(circle, rgba(0,229,255,0.2) 0%, rgba(0,229,255,0) 70%)',
                borderRadius: '50%',
                top: '-40px',
                right: '-40px',
                filter: 'blur(30px)',
                zIndex: 1
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;