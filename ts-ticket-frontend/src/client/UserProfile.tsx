import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Snackbar,
  Alert,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Card,
  CardMedia,
  Container
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserWithBookings } from '../CRUD/Types'; 

const API_URL =  'http://localhost:5000';

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

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '90vh',
        flexDirection: { xs: 'column', md: 'row' },
        backgroundColor: '#ffffff'
      }}
    >

      <Box
        sx={{
          flexBasis: { md: '55%' },
          display: { xs: 'none', md: 'flex' },
          position: 'relative',
          overflow: 'hidden',
          p: 2,
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1489278353717-f64c6ee8a4d2?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Cinema background"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '10px',
            objectPosition: 'center'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 40,
            left: 40,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '16px 24px',
            borderRadius: '8px',
            maxWidth: '70%'
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#232323' }}>
            Welcome to Your Profile
          </Typography>
          <Typography variant="body1" sx={{ color: '#555555', mt: 1 }}>
            Manage your account and view your bookings
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          flexBasis: { md: '45%' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          p: { xs: 3, sm: 6 },
          backgroundColor: '#ffffff'
        }}
      >
        {/* User Info */}
        <Container sx={{ maxWidth: 600 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, textAlign: 'center' }}>
            Your Profile
          </Typography>
          {userData && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Name: {userData.nom}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
                Email: {userData.email}
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 2, borderRadius: '8px', textTransform: 'none', fontWeight: 500 }}
                onClick={handleChangePassword}
              >
                Change Password
              </Button>
            </Box>
          )}

          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Your Bookings
          </Typography>
          {userData?.reservations && userData.reservations.length > 0 ? (
            userData.reservations.map((booking) => (
              <Box key={booking.id} sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Booking #{booking.id} - {new Date(booking.date_reservation).toLocaleString()}
                </Typography>
                {booking.seance && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 2 }}>
                    {booking.seance.film?.poster && (
                      <Card sx={{ width: 80, height: 120 }}>
                        <CardMedia
                          component="img"
                          image={booking.seance.film.poster}
                          alt={booking.seance.film.nom}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Card>
                    )}
                    <Box>
                      <Typography variant="body1">
                        <strong>Film:</strong> {booking.seance.film?.nom}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Salle:</strong> {booking.seance.salle?.nom}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Time:</strong> {new Date(booking.seance.heure).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                )}
                {/* Tickets table */}
                {booking.tickets && booking.tickets.length > 0 && (
                  <Table sx={{ mt: 2 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Fare Type</TableCell>
                        <TableCell>Seat</TableCell>
                        <TableCell>Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {booking.tickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell>{ticket.type}</TableCell>
                          <TableCell>{ticket.num_siege}</TableCell>
                          <TableCell>{ticket.price} $</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Box>
            ))
          ) : (
            <Typography variant="body1">No bookings found.</Typography>
          )}
        </Container>
      </Box>

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
    </Box>
  );
};

export default UserProfile;
