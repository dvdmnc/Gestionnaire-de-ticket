import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Snackbar,
  Alert,
  Button,
  Card,
  CardMedia,
  Container,
  Grid,
  Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserWithBookings } from '../CRUD/Types';

const API_URL = 'http://localhost:5000';

const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState<UserWithBookings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const navigate = useNavigate();
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    if (!userId) {
      setError('No user ID found');
      setOpenSnackbar(true);
      return;
    }
    fetchUserProfile(userId);
  }, [userId]);

  const fetchUserProfile = async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/users/${id}`);
      setUserData(response.data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Failed to load user profile');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setError(null);
  };

  const handleChangePassword = () => {
    navigate('/reset-password');
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Box sx={{ background: 'linear-gradient(to right, rgb(8, 30, 63), rgb(0, 6, 34))', color: '#fff', py: 8, minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <Box sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 3, p: 4, textAlign: 'center' }}>
            <Avatar
  sx={{ width: 96, height: 96, mx: 'auto', mb: 2 }}
  src="https://t3.ftcdn.net/jpg/03/94/89/90/360_F_394899054_4TMgw6eiMYUfozaZU3Kgr5e0LdH4ZrsU.jpg"
/>
              <Typography variant="h6" sx={{ fontFamily: 'Montserrat, sans-serif', color: '#ffffff' }}>{userData?.nom}</Typography>
              <Typography variant="body2" sx={{ fontFamily: 'Montserrat, sans-serif', color: '#c3d0ff', mb: 2 }}>{userData?.email}</Typography>
              <Button
                variant="outlined"
                onClick={handleChangePassword}
                sx={{
                  color: '#fff',
                  borderColor: '#1976d2',
                  fontFamily: 'Montserrat, sans-serif',
                  textTransform: 'none',
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    borderColor: '#1565c0'
                  }
                }}
              >
                Change Password
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="h4" sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, mb: 4 }}>
              Booking History
            </Typography>

            {userData?.reservations && userData.reservations.length > 0 ? (
              userData.reservations.map((booking) => (
                <Box key={booking.id} sx={{ mb: 5, backgroundColor: 'rgba(255, 255, 255, 0.05)', p: 3, borderRadius: 3 }}>
                  <Typography variant="subtitle1" sx={{ color: '#fff', fontFamily: 'Poppins, sans-serif', mb: 2 }}>
                    Booking {booking.id} — {formatDate(booking.seance?.heure || booking.date_reservation)}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      {booking.seance?.film?.poster && (
                        <Card sx={{ height: '100%', borderRadius: 2, overflow: 'hidden' }}>
                          <CardMedia
                            component="img"
                            image={booking.seance.film.poster}
                            alt={booking.seance.film.nom}
                            sx={{ height: '100%', objectFit: 'cover' }}
                          />
                        </Card>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography variant="h5" sx={{ fontFamily: 'Poppins, sans-serif', color: '#fff', mb: 1 }}>
                        {booking.seance?.film?.nom}
                      </Typography>
                      <Typography variant="body1" sx={{ fontFamily: 'Montserrat, sans-serif', color: '#c3d0ff' }}>
                        {booking.seance?.salle?.nom}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" sx={{ color: '#c3d0ff', fontFamily: 'Montserrat, sans-serif', mb: 1 }}>Tickets:</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      {booking.tickets.map((ticket) => (
                        <Box
                          key={ticket.id}
                          sx={{
                            backgroundColor: 'rgba(129, 164, 255, 0.15)',
                            border: '1px solid rgba(129, 164, 255, 0.4)',
                            borderRadius: '12px',
                            px: 3,
                            py: 2,
                            minWidth: '160px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            color: '#fff',
                            fontFamily: 'Montserrat, sans-serif'
                          }}
                        >
                          <Typography variant="body2" sx={{ 
                                                            fontFamily: 'Montserrat, sans-serif',
                                                            fontWeight: 600 }}>
                            {ticket.type}</Typography>
                          <Typography variant="body2" sx={{  fontFamily: 'Montserrat, sans-serif' }}>Seat {ticket.num_siege}</Typography>
                          <Typography variant="body2" sx={{  fontFamily: 'Montserrat, sans-serif'}}>{ticket.price} $</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography sx={{ fontFamily: 'Montserrat, sans-serif', color: '#c3d0ff' }}>No bookings found.</Typography>
            )}
          </Grid>
        </Grid>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default UserProfile;
