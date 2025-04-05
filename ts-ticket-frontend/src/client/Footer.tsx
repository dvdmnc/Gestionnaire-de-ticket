import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Link, 
  Stack, 
  Divider, 
  Button,
  useMediaQuery,
  useTheme
} from '@mui/material';

// Footer links organized by section
const footerLinks = [
  {
    title: 'Company',
    links: [
      { name: 'About Us', url: '#' },
      { name: 'Our Theaters', url: '#' },
      { name: 'Careers', url: '#' },
      { name: 'Contact Us', url: '#' },
    ]
  },
  {
    title: 'Movies',
    links: [
      { name: 'Now Showing', url: '#' },
      { name: 'Coming Soon', url: '#' },
      { name: 'Promotions', url: '#' },
      { name: 'Gift Cards', url: '#' },
    ]
  },
  {
    title: 'Support',
    links: [
      { name: 'Help Center', url: '#' },
      { name: 'FAQs', url: '#' },
      { name: 'Privacy Policy', url: '#' },
      { name: 'Terms of Service', url: '#' },
    ]
  }
];

// Social media icons
const socialLinks = [
  { name: 'Facebook', icon: 'F', url: '#' },
  { name: 'Twitter', icon: 'T', url: '#' },
  { name: 'Instagram', icon: 'I', url: '#' },
  { name: 'YouTube', icon: 'Y', url: '#' },
];

const Footer: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box 
      sx={{         
        background: 'linear-gradient(to right,rgb(8, 30, 63) 0%,rgb(0, 6, 34) 100%)',
        color: '#fff',
        py: { xs: 6, md: 8 },
        position: 'relative',
      }}
    >
      <Container>
        {/* Main footer content */}
        <Grid container spacing={4}>
          {/* Logo and company description */}
          <Grid item xs={12} md={4}>
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                fontWeight: 600,
                mb: 2,
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              CineManage
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 3,
                color: '#c3d0ff',
                fontFamily: 'Montserrat, sans-serif',
                maxWidth: '90%'
              }}
            >
              Experience the magic of cinema with CineManage. Bringing you the best movies, comfort, and entertainment since 2005.
            </Typography>
            
            <Button 
              variant="outlined" 
              sx={{ 
                fontFamily: 'Montserrat, sans-serif',
                textTransform: 'none',
                borderRadius: 2,
                borderColor: '#1976d2',
                color: '#ffffff',
                '&:hover': {
                  borderColor: '#1565c0',
                  backgroundColor: 'rgba(25, 118, 210, 0.1)',
                }
              }}
            >
              Download Our App
            </Button>
          </Grid>
          
          {/* Footer links */}
          {footerLinks.map((section) => (
            <Grid item xs={12} sm={6} md={2.6} key={section.title}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 2,
                  fontFamily: 'Poppins, sans-serif',
                }}
              >
                {section.title}
              </Typography>
              
              <Stack spacing={1.5}>
                {section.links.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.url} 
                    underline="hover"
                    sx={{ 
                      color: '#c3d0ff',
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '0.875rem',
                      fontWeight: 400,
                      transition: 'all 0.2s ease',
                      textDecoration: 'none',
                      '&:hover': {
                        color: '#ffffff',
                      }
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>
        
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 4 }} />
        
        {/* Bottom row with copyright and social links */}
        <Grid 
          container 
          justifyContent="space-between" 
          alignItems="center"
          spacing={2}
          direction={isMobile ? 'column-reverse' : 'row'}
        >
          <Grid item xs={12} md={6}>
            <Typography 
              variant="body2" 
              sx={{ 
                fontFamily: 'Montserrat, sans-serif',
                color: '#c3d0ff',
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              © 2025 CineManage. All rights reserved.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Stack 
              direction="row" 
              spacing={2} 
              justifyContent={{ xs: 'center', md: 'flex-end' }}
              mb={isMobile ? 2 : 0}
            >
              {socialLinks.map((social) => (
                <Box
                  key={social.name}
                  component={Link}
                  href={social.url}
                  aria-label={social.name}
                  sx={{ 
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    backgroundColor: 'rgba(25, 118, 210, 0.2)',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: '#1976d2',
                    }
                  }}
                >
                  {social.icon}
                </Box>
              ))}
            </Stack>
          </Grid>
        </Grid>
        
        {/* Newsletter subscription */}
        <Box 
          sx={{ 
            mt: 4, 
            p: 3, 
            borderRadius: 2, 
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 0.5,
                  fontFamily: 'Poppins, sans-serif',
                }}
              >
                Stay Updated
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#c3d0ff',
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                Subscribe to our newsletter for exclusive movie news and promotions.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box 
                component="form" 
                sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 1
                }}
              >
                <input
                  type="email"
                  placeholder="Your email address"
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    outline: 'none',
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                />
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#1976d2',
                    fontFamily: 'Montserrat, sans-serif',
                    textTransform: 'none',
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: '#1565c0',
                    }
                  }}
                >
                  Subscribe
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;