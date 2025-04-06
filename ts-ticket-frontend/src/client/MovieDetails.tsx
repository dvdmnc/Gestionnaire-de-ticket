import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid,
  Button,
  Chip,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Paper,
  Card,
  CardContent,
  CardActions,
  Rating
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { getFilmById } from '../CRUD/FilmController';
import { getSeances } from '../CRUD/SeanceController';
import { getSalles } from '../CRUD/SalleController';
import { Film, Seance, Salle } from '../CRUD/Types';
import { useNavigate } from "react-router-dom";




const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [film, setFilm] = useState<Film | null>(null);
  const [seances, setSeances] = useState<Seance[]>([]);
  const [salles, setSalles] = useState<Salle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  

  const handleBookFilm = (film: Film) => {
    // Store selected film in sessionStorage
    sessionStorage.setItem('selectedFilm', JSON.stringify(film));
    // Navigate to reservations page
    navigate('/client/reservation');
  }
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          setError('Movie ID is missing');
          setLoading(false);
          return;
        }
        
        // Fetch the specific film by ID
        const selectedFilm = await getFilmById(Number(id));
        
        if (!selectedFilm) {
          setError('Movie not found');
          setLoading(false);
          return;
        }
        
        setFilm(selectedFilm);
        
        // Fetch all halls to get their names
        const allSalles = await getSalles();
        setSalles(allSalles);
        
        // Fetch seances for this film
        const allSeances = await getSeances();
        const filmSeances = allSeances.filter(s => s.film_id === Number(id));
        setSeances(filmSeances);
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch movie details:', err);
        setError('Failed to load movie details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  // Find hall name by ID
  const getHallName = (salleId: number) => {
    const salle = salles.find(s => s.id === salleId);
    return salle ? salle.nom : `Hall ${salleId}`;
  };

  // Group seances by date for better organization
  const groupedSeances = seances.reduce((groups, seance) => {
    // Extract date from the full timestamp
    const date = seance.heure.split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(seance);
    return groups;
  }, {} as Record<string, Seance[]>);

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time to be more readable
  const formatTime = (timeString: string) => {
    const time = new Date(timeString);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format duration from minutes to hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0 && remainingMinutes > 0) {
      return `${hours}h ${remainingMinutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${remainingMinutes}m`;
    }
  };

  return (
    <Box 
      sx={{         
        background: 'linear-gradient(to right,rgb(8, 30, 63) 0%,rgb(0, 6, 34) 100%)',
        color: '#fff', 
        py: { xs: 6, md: 8 },
        minHeight: '100vh'
      }}
    >
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress sx={{ color: '#1976d2' }} />
        </Box>
      )}
      
      {error && (
        <Container>
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
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </Box>
        </Container>
      )}
      
      {!loading && !error && film && (
        <Container>
          {/* Movie Details Section */}
          <Paper 
            elevation={3}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              mb: 6
            }}
          >
            <Grid container>
              {/* Movie Poster */}
              <Grid item xs={12} md={4}>
                <Box 
                  sx={{ 
                    height: { xs: '350px', md: '500px' },
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Box 
                    component="img"
                    src={film.poster || 'https://www.semantus.fr/clap/static/images/poster-placeholder.png'}
                    alt={film.nom}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  {film.genre && (
                    <Chip 
                      label={film.genre} 
                      size="small"
                      sx={{ 
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        color: '#1976d2',
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: 500
                      }}
                    />
                  )}
                </Box>
              </Grid>
              
              {/* Movie Info */}
              <Grid item xs={12} md={8}>
                <Box sx={{ p: { xs: 3, md: 5 } }}>
                  <Typography 
                    variant="h3" 
                    component="h1" 
                    sx={{ 
                      fontWeight: 700,
                      mb: 1,
                      fontFamily: 'Poppins, sans-serif',
                      color: '#ffffff'
                    }}
                  >
                    {film.nom}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    {film.annee && (
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: '#c3d0ff',
                          fontFamily: 'Montserrat, sans-serif'
                        }}
                      >
                        {film.annee}
                      </Typography>
                    )}
                    
                    {film.duree && (
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: '#c3d0ff',
                          fontFamily: 'Montserrat, sans-serif',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}
                      >
                        <span>⏱</span> {formatDuration(film.duree)}
                      </Typography>
                    )}
                    
                    {/* Mock rating - can be replaced with actual data */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={4.5} precision={0.5} readOnly size="small" />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          ml: 1,
                          color: '#c3d0ff',
                          fontFamily: 'Montserrat, sans-serif'
                        }}
                      >
                        (4.5/5)
                      </Typography>
                    </Box>
                  </Box>
                  
                  {film.description && (
                    <Box sx={{ mb: 4 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          mb: 1,
                          fontFamily: 'Poppins, sans-serif',
                          color: '#81a4ff'
                        }}
                      >
                        Synopsis
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontFamily: 'Montserrat, sans-serif',
                          lineHeight: 1.7,
                          color: '#e0e0e0'
                        }}
                      >
                        {film.description || "No description available for this film."}
                      </Typography>
                    </Box>
                  )}
                  
                  {film.realisateur && (
                    <Box sx={{ mb: 4 }}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontFamily: 'Montserrat, sans-serif',
                          color: '#c3d0ff'
                        }}
                      >
                        <strong>Director:</strong> {film.realisateur}
                      </Typography>
                    </Box>
                  )}
                  
                  <Button 
                    variant="contained" 
                    sx={{ 
                      backgroundColor: '#00e5ff',
                      color: '#051937',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: 2,
                      px: 4,
                      py: 1.2,
                      '&:hover': {
                        backgroundColor: '#00c4d8',
                      }
                    }}
                    onClick={() => handleBookFilm(film)}
                  >
                    Book Tickets
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Seances Section */}
          <Box id="seances-section">
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
                AVAILABLE SHOWTIMES
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
                Select a Showtime
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
                Choose from our available showtimes and book your seats now.
              </Typography>
            </Box>
            
            {seances.length === 0 ? (
              <Box sx={{ textAlign: 'center', my: 6 }}>
                <Typography variant="h6" gutterBottom fontFamily="Poppins, sans-serif">
                  No showtimes are currently available for this movie.
                </Typography>
                <Button 
                  variant="contained"
                  sx={{ 
                    mt: 2,
                    fontFamily: 'Montserrat, sans-serif',
                    textTransform: 'none',
                    borderRadius: 2
                  }}
                  onClick={() => navigate(-1)}
                >
                  Go Back
                </Button>
              </Box>
            ) : (
              <Box>
                {Object.keys(groupedSeances).map((date) => (
                  <Box key={date} sx={{ mb: 5 }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 600,
                        mb: 3,
                        fontFamily: 'Poppins, sans-serif',
                        color: '#81a4ff',
                        borderBottom: '1px solid rgba(129, 164, 255, 0.3)',
                        pb: 1
                      }}
                    >
                      {formatDate(date)}
                    </Typography>
                    
                    <Grid container spacing={3}>
                      {groupedSeances[date].map((seance) => (
                        <Grid item xs={12} sm={6} md={4} key={seance.id}>
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
                            <CardContent>
                              <Typography 
                                variant="h5" 
                                component="div" 
                                sx={{ 
                                  fontWeight: 700,
                                  mb: 2,
                                  color: '#212529',
                                  fontFamily: 'Poppins, sans-serif',
                                  textAlign: 'center'
                                }}
                              >
                                {formatTime(seance.heure)}
                              </Typography>
                              
                              <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                mb: 2,
                                color: '#666'
                              }}>
                                <Typography variant="body2" fontFamily="Montserrat, sans-serif">
                                  Theater
                                </Typography>
                                <Typography variant="body2" fontWeight={600} fontFamily="Montserrat, sans-serif">
                                  {getHallName(seance.salle_id)}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                color: '#666'
                              }}>
                                <Typography variant="body2" fontFamily="Montserrat, sans-serif">
                                  Seats Available
                                </Typography>
                                <Typography variant="body2" fontWeight={600} fontFamily="Montserrat, sans-serif">
                                  {seance.seatleft !== undefined ? seance.seatleft : "N/A"}
                                </Typography>
                              </Box>
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
                                Book Now
                              </Button>
                            </CardActions>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Container>
      )}
    </Box>
  );
};

export default MovieDetails;