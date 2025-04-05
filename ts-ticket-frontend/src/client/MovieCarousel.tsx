import React from 'react';
import { Box, Typography, Container, Card, CardMedia, Grid } from '@mui/material';

interface Movie {
  id: number;
  title: string;
  poster: string;
}

const sampleMovies: Movie[] = [
  { id: 1, title: 'Movie One', poster: 'https://via.placeholder.com/200x300?text=Movie+1' },
  { id: 2, title: 'Movie Two', poster: 'https://via.placeholder.com/200x300?text=Movie+2' },
  { id: 3, title: 'Movie Three', poster: 'https://via.placeholder.com/200x300?text=Movie+3' },
];

const MovieCarousel: React.FC = () => {
  return (
    <Box sx={{ py: 8, backgroundColor: '#bbdefb' }}>
      <Container>
        <Typography variant="h4" component="h2" align="center" sx={{ mb: 4, fontWeight: 600 }}>
          Now Showing
        </Typography>
        <Grid container spacing={4}>
          {sampleMovies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} key={movie.id}>
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia component="img" image={movie.poster} alt={movie.title} />
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" component="div">
                    {movie.title}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default MovieCarousel;
