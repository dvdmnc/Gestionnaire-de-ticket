import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Card, 
  CardMedia, 
  Grid,
  Button,
  CardContent,
  CardActions,
  Chip,
  useMediaQuery,
  useTheme,
  CircularProgress
} from '@mui/material';
import { getFilms } from '../../CRUD/FilmController.ts';
import { Film } from '../../CRUD/Types.ts';
import {useNavigate} from "react-router-dom";

// Add font imports to your index.html or via Material UI theme
// <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

const MovieCarousel: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const handleBookFilm = (film: Film) => {
        // Store selected film in sessionStorage
        sessionStorage.setItem('selectedFilm', JSON.stringify(film));
        // Navigate to reservations page
        navigate('/client/reservation');
    }
    useEffect(() => {
    const fetchFilms = async () => {
      try {
        setLoading(true);
        const data = await getFilms();
        setFilms(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch films:', err);
        setError('Failed to load films. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFilms();
  }, []);
  
  const visibleMovies = isMobile ? 1 : 3;
  let displayMovies: Film[] = [];
  
  if (films.length > 0) {
    displayMovies = films.slice(currentIndex, currentIndex + visibleMovies);
    
    if (displayMovies.length < visibleMovies) {
      const additional = films.slice(0, visibleMovies - displayMovies.length);
      displayMovies = [...displayMovies, ...additional];
    }
  }

  const nextSlide = () => {
    if (films.length === 0) return;
    setCurrentIndex((prevIndex) => 
      prevIndex + 1 >= films.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    if (films.length === 0) return;
    setCurrentIndex((prevIndex) => 
      prevIndex - 1 < 0 ? films.length - 1 : prevIndex - 1
    );
  };

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
      <Container>
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Typography 
            variant="overline" 
            sx={{ 
              color: '#81a4ff', 
              fontWeight: 500,
              letterSpacing: 1.5,
              mb: 1,
              display: 'block',
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            NOW SHOWING
          </Typography>
          
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              mb: 2, 
              fontWeight: 600,
              color: '#ffffff',
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            Featured Films
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              maxWidth: '600px', 
              mx: 'auto',
              color: '#c3d0ff',
              fontFamily: 'Montserrat, sans-serif',
              mb: 3
            }}
          >
            Explore our selection of films currently showing at our theaters.
          </Typography>
        </Box>
        
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
            <CircularProgress sx={{ color: '#1976d2' }} />
          </Box>
        )}
        
        {error && (
          <Box sx={{ textAlign: 'center', my: 6 }}>
            <Typography variant="h6" color="error" gutterBottom fontFamily="Poppins, sans-serif">
              {error}
            </Typography>
            <Button 
              variant="contained"
              sx={{ 
                mt: 2,
                fontFamily: 'Montserrat, sans-serif',
                textTransform: 'none',
                borderRadius: 2
              }}
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </Box>
        )}
        
        {!loading && !error && films.length === 0 && (
          <Box sx={{ textAlign: 'center', my: 6 }}>
            <Typography variant="h6" gutterBottom fontFamily="Poppins, sans-serif">
              No films are currently available.
            </Typography>
          </Box>
        )}
        
        {!loading && !error && films.length > 0 && (
          <>
            <Grid container spacing={3}>
              {displayMovies.map((film) => (
                <Grid item xs={12} sm={6} md={4} key={film.id}>
                  <Card 
                    sx={{ 
                      borderRadius: 2,
                      overflow: 'hidden',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
                      }
                    }}
                  >
                    <Box sx={{ position: 'relative', overflow: 'hidden', pt: '140%' }}>
                      <CardMedia 
                        component="img" 
                        image={film.poster || 'https://www.semantus.fr/clap/static/images/poster-placeholder.png'} 
                        alt={film.nom}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          }
                        }}
                      />
                      
                      {film.genre && (
                        <Chip 
                          label={film.genre} 
                          size="small"
                          sx={{ 
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            color: '#1976d2',
                            fontFamily: 'Montserrat, sans-serif',
                            fontWeight: 500,
                            fontSize: '0.75rem'
                          }}
                        />
                      )}
                    </Box>
                    
                    <CardContent>
                      <Typography 
                        variant="h6" 
                        component="div" 
                        sx={{ 
                          fontWeight: 600,
                          mb: 1,
                          color: '#212529',
                          fontFamily: 'Poppins, sans-serif'
                        }}
                      >
                        {film.nom}
                      </Typography>
                      
                      {film.duree && (
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#a0a0a0',
                            fontFamily: 'Montserrat, sans-serif',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                          }}
                        >
                          <span>⏱</span> {film.duree}
                        </Typography>
                      )}
                    </CardContent>
                    
                    <CardActions sx={{ px: 2, pb: 2 }}>
                      <Button 
                        variant="contained" 
                        fullWidth
                        sx={{ 
                          backgroundColor: '#1976d2',
                          fontFamily: 'Montserrat, sans-serif',
                          fontWeight: 500,
                          textTransform: 'none',
                          borderRadius: 2,
                          '&:hover': {
                            backgroundColor: '#1565c0',
                          }
                        }}
                        onClick={() => handleBookFilm(film)}
                      >
                        Book Tickets
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                gap: 2,
                mt: 4
              }}
            >
              <Button 
                onClick={prevSlide}
                variant="outlined"
                sx={{ 
                  fontFamily: 'Montserrat, sans-serif',
                  textTransform: 'none',
                  borderRadius: 2,
                  minWidth: '100px',
                }}
              >
                Previous
              </Button>
              
              <Button 
                onClick={nextSlide}
                variant="contained"
                sx={{ 
                  fontFamily: 'Montserrat, sans-serif',
                  textTransform: 'none',
                  borderRadius: 2,
                  minWidth: '100px',
                }}
              >
                Next
              </Button>
            </Box>
            
            <Box sx={{ textAlign: 'center', mt: 5 }}>
              <Button 
                variant="text"
                sx={{ 
                  color: '#ffffff',
                  fontFamily: 'Montserrat, sans-serif',
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                View All Movies
              </Button>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default MovieCarousel;