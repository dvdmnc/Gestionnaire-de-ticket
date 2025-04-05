import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: '#0d47a1', color: '#fff', py: 4, mt: 4 }}>
      <Container>
        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} CineManage. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
