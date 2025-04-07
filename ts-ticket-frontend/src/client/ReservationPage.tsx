import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Button,
    Stepper,
    Step,
    StepLabel,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Divider,
    Paper,
    Chip,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import { FilmWithSeances, Seance, Salle, types, BookingWithTickets } from "../CRUD/Types.ts";
import {Ticket} from "../CRUD/Types.ts";
import { getFilms} from "../CRUD/FilmController.ts";
import { getSalles} from "../CRUD/SalleController.ts";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import EventIcon from '@mui/icons-material/Event';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {getSeances} from "../CRUD/SeanceController.ts";
import {createBooking as apiCreateBooking} from "../CRUD/BookingController.ts";
import axios from "axios";
import {useNavigate} from "react-router-dom";

// Create a mock function for creating a booking
// In a real app, this would be your actual API call
    const createBooking = async (booking: BookingWithTickets) => {
        try {
            // Call the real API function
            const createdBooking = await apiCreateBooking(booking);

            // Return the created booking
            return createdBooking;
        } catch (error) {
            // Handle any errors
            console.error('Error in createBooking:', error);

            // Re-throw the error to be handled by the calling function
            throw error;
        }
};

const steps = ['Select Movie', 'Select Screening', 'Choose Seats', 'Confirm & Pay'];

// Define ticket prices
const ticketPrices = {
    normal: 10.00,
    reduit: 7.50,
    enfant: 5.00
};

const ReservationPage: React.FC = () => {
    // Current step in the booking process
    const [activeStep, setActiveStep] = useState(0);

    // Data states
    const [films, setFilms] = useState<FilmWithSeances[]>([]);
    const [salles, setSalles] = useState<Salle[]>([]);
    const [loading, setLoading] = useState(true);

    // Selection states
    const [selectedFilm, setSelectedFilm] = useState<FilmWithSeances | null>(null);
    const [selectedSeance, setSelectedSeance] = useState<Seance | null>(null);
    const [selectedSalle, setSelectedSalle] = useState<Salle | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<{id: string, type: types}[]>([]);

    // States for seat selection
    const [availableSeats, setAvailableSeats] = useState<number[]>([]);
    const [selectedSeatType, setSelectedSeatType] = useState<types>('normal');

    // Success dialog
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [bookingReference, setBookingReference] = useState('');

    const navigate = useNavigate();


    useEffect(()=>{
        console.log('Available seats:', availableSeats);
    },[availableSeats])
    useEffect(() => {
        const preselectedFilm = sessionStorage.getItem('selectedFilm');
        if (preselectedFilm) {
            try {
                const parsedFilm = JSON.parse(preselectedFilm);
                // Set as selected film and convert to FilmWithSeances format
                setSelectedFilm({...parsedFilm, seances: []});
                // Move to screening selection step
                setActiveStep(1);
                // Clear from session storage to avoid persistence issues
                sessionStorage.removeItem('selectedFilm');
            } catch (e) {
                console.error('Error parsing preselected film:', e);
            }
        }
    }, []);
            // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [filmsData, sallesData] = await Promise.all([
                    getFilms(),
                    getSalles()
                ]);

                // Convert films to FilmWithSeances
                const filmsWithSeances = filmsData.map(film => ({
                    ...film,
                    seances: []
                }));

                setFilms(filmsWithSeances);
                setSalles(sallesData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
// Update the useEffect to fetch screenings when a film is selected
    useEffect(() => {
        const fetchScreenings = async () => {
            if (selectedFilm && selectedFilm.id) {
                try {
                    setLoading(true);
                    // Fetch screenings for the selected film
                    const response = await getSeances();

                    // Filter seances for the selected film
                    const filmScreenings = response.filter(seance => seance.film_id === selectedFilm.id);

                    // Update the film with its screenings
                    setSelectedFilm({
                        ...selectedFilm,
                        seances: filmScreenings
                    });
                } catch (error) {
                    console.error('Error fetching screenings:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchScreenings();
    }, [selectedFilm?.id]);

    // Fetch available seats for a given seance
    const fetchAvailableSeats = async (seanceId: number, salle: Salle, existingTickets: Ticket[] = []) => {
        setLoading(true);
        try {

            const response = await axios.get(`http://localhost:5000/tickets?seance_id=${seanceId}`);
            const takenTickets: Ticket[] = response.data;
            const allSeatNumbers = Array.from({ length: salle.capacity }, (_, i) => i + 1);

            const existingTicketSeats = existingTickets.map(ticket => parseInt(ticket.num_siege));
            const takenSeatNumbers = takenTickets
                .filter(ticket => !existingTicketSeats.includes(parseInt(ticket.num_siege)))
                .map(ticket => parseInt(ticket.num_siege));

            // Filter out seats that are already taken by other bookings
            const available = allSeatNumbers.filter(seatNum => !takenSeatNumbers.includes(seatNum));

            console.log("Available seats:", available);
            console.log("Existing ticket seats:", existingTicketSeats);

            setAvailableSeats(available);
        } catch (error) {
            console.error("Error fetching available seats:", error);
            // If the API fails, fallback to showing all seats
            if (salle) {
                const allSeatNumbers = Array.from({ length: salle.capacity }, (_, i) => i + 1);
                setAvailableSeats(allSeatNumbers);
            }
        } finally {
            setLoading(false);
        }
    };

// Then, replace your random seat generation useEffect with this:

// Fetch available seats when a seance is selected
    useEffect(() => {
        if (selectedSeance && selectedSalle) {
            // Pass any existing tickets if editing a booking
            const existingTickets: Ticket[] = []; // This would come from props if editing
            fetchAvailableSeats(selectedSeance.id, selectedSalle, existingTickets);
        }
    }, [selectedSeance, selectedSalle]);
    // Handle next step in the booking process
    const handleNext = () => {
        const token = localStorage.getItem('token');

        if(!token) {
            navigate('/login');
            return;
        }

        setActiveStep((prevStep) => prevStep + 1);
    };

    // Handle going back a step
    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    // Handle film selection
    const handleFilmSelect = (film: FilmWithSeances) => {
        setSelectedFilm(film);
        setSelectedSeance(null);
        setSelectedSalle(null);
        setSelectedSeats([]);
        handleNext();
    };

    // Handle screening selection
    const handleSeanceSelect = (seance: Seance) => {
        setSelectedSeance(seance);
        const salle = salles.find(s => s.id === seance.salle_id);
        setSelectedSalle(salle || null);
        setSelectedSeats([]);
        handleNext();
    };

    // Handle seat selection
    const handleSeatSelect = (seatNumber: number) => {
        const seatId = seatNumber.toString();

        // Check if the seat is already selected
        const existingSeatIndex = selectedSeats.findIndex(seat => seat.id === seatId);

        if (existingSeatIndex >= 0) {
            // Remove the seat if it's already selected
            setSelectedSeats(selectedSeats.filter((_, index) => index !== existingSeatIndex));
        } else {
            // Add the seat with the currently selected type
            setSelectedSeats([...selectedSeats, { id: seatId, type: selectedSeatType }]);
        }
    };

    // Handle seat type change for selection
    const handleSeatTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedSeatType(event.target.value as types);
    };

    // Handle submission of the booking
    const handleSubmitBooking = async () => {
        try {
            setLoading(true);

            if (!selectedFilm || !selectedSeance) {
                throw new Error('Missing required booking information');
            }
            console.log(localStorage.getItem('user'));
            // In a real app, you would get the user ID from the authentication context
            const userId = localStorage.getItem('user_id')


            // Create tickets from selected seats
            const tickets = selectedSeats.map(seat => ({
                id: 0, // This will be assigned by the server
                reservation_id: 0, // This will be assigned by the server
                num_siege: seat.id,
                type: seat.type,
                price: ticketPrices[seat.type]
            }));

            // Create the booking
            const booking: BookingWithTickets = {
                id: 0, // This will be assigned by the server
                user_id: userId,
                seance_id: selectedSeance.id,
                date_reservation: new Date().toISOString(),
                tickets: tickets
            };

            // Submit the booking
            await createBooking(booking);

            // Generate a booking reference
            const reference = `CG-${Math.floor(Math.random() * 1000000)}`;
            setBookingReference(reference);

            // Show success dialog
            setSuccessDialogOpen(true);
        } catch (error) {
            console.error('Error creating booking:', error);
            alert('Failed to create booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Calculate total price
    const calculateTotal = () => {
        return selectedSeats.reduce((total, seat) => {
            return total + ticketPrices[seat.type];
        }, 0);
    };

    // Reset the booking process
    const handleReset = () => {
        setActiveStep(0);
        setSelectedFilm(null);
        setSelectedSeance(null);
        setSelectedSalle(null);
        setSelectedSeats([]);
        setSuccessDialogOpen(false);
    };

    // Render the film selection step
    const renderFilmSelection = () => {
        if (loading) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
                    <CircularProgress sx={{ color: '#1976d2' }} />
                </Box>
            );
        }

        return (
            <Box>
                <Typography
                    variant="h5"
                    sx={{
                        mb: 3,
                        fontWeight: 600,
                        fontFamily: 'Poppins, sans-serif',
                        color: '#051937'
                    }}
                >
                    Select a Movie
                </Typography>

                <Grid container spacing={3}>
                    {films.map((film) => (
                        <Grid item xs={12} sm={6} md={4} key={film.id}>
                            <Card
                                sx={{
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
                                    }
                                }}
                                onClick={() => handleFilmSelect(film)}
                            >
                                <Box sx={{ position: 'relative', overflow: 'hidden', pt: '140%' }}>
                                    <CardMedia
                                        component="img"
                                        image={film.poster || 'https://via.placeholder.com/300x450?text=No+Poster'}
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

                                    <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                                        {film.duree && (
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: '#616161',
                                                    fontFamily: 'Montserrat, sans-serif',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5
                                                }}
                                            >
                                                <span>⏱</span> {film.duree} min
                                            </Typography>
                                        )}

                                        {film.annee && (
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: '#616161',
                                                    fontFamily: 'Montserrat, sans-serif'
                                                }}
                                            >
                                                {film.annee}
                                            </Typography>
                                        )}
                                    </Box>

                                    <Button
                                        variant="contained"
                                        fullWidth
                                        sx={{
                                            backgroundColor: '#1976d2',
                                            fontFamily: 'Montserrat, sans-serif',
                                            fontWeight: 500,
                                            textTransform: 'none',
                                            borderRadius: 2,
                                            mt: 1,
                                            '&:hover': {
                                                backgroundColor: '#1565c0',
                                            }
                                        }}
                                    >
                                        Select
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    };

// Render the screening selection step
    const renderScreeningSelection = () => {
        if (loading) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
                    <CircularProgress sx={{ color: '#1976d2' }} />
                </Box>
            );
        }

        return (
            <Box>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                    sx={{
                        mb: 3,
                        fontFamily: 'Montserrat, sans-serif',
                        textTransform: 'none',
                    }}
                >
                    Back to movies
                </Button>

                {selectedFilm && (
                    <Box sx={{ display: 'flex', gap: 3, mb: 4, flexDirection: { xs: 'column', md: 'row' } }}>
                        <Box sx={{
                            width: { xs: '100%', md: '30%' },
                            maxWidth: { xs: '300px', md: '300px' },
                            alignSelf: 'center'
                        }}>
                            <Card sx={{
                                borderRadius: 2,
                                overflow: 'hidden',
                                boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                            }}>
                                <CardMedia
                                    component="img"
                                    image={selectedFilm.poster || 'https://via.placeholder.com/300x450?text=No+Poster'}
                                    alt={selectedFilm.nom}
                                    sx={{ height: 'auto' }}
                                />
                            </Card>
                        </Box>

                        <Box sx={{ flexGrow: 1 }}>
                            <Typography
                                variant="h4"
                                component="h1"
                                sx={{
                                    fontWeight: 700,
                                    mb: 1,
                                    color: '#051937',
                                    fontFamily: 'Montserrat, sans-serif'
                                }}
                            >
                                {selectedFilm.nom}
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                                {selectedFilm.duree && (
                                    <Chip
                                        label={`${selectedFilm.duree} min`}
                                        size="small"
                                        sx={{
                                            backgroundColor: '#e3f2fd',
                                            color: '#0277bd',
                                            fontFamily: 'Montserrat, sans-serif'
                                        }}
                                    />
                                )}

                                {selectedFilm.annee && (
                                    <Chip
                                        label={selectedFilm.annee.toString()}
                                        size="small"
                                        sx={{
                                            backgroundColor: '#e8f5e9',
                                            color: '#2e7d32',
                                            fontFamily: 'Montserrat, sans-serif'
                                        }}
                                    />
                                )}

                                {selectedFilm.genre && (
                                    <Chip
                                        label={selectedFilm.genre}
                                        size="small"
                                        sx={{
                                            backgroundColor: '#fff8e1',
                                            color: '#ff8f00',
                                            fontFamily: 'Montserrat, sans-serif'
                                        }}
                                    />
                                )}
                            </Box>

                            {selectedFilm.description && (
                                <Typography
                                    variant="body1"
                                    sx={{
                                        mb: 3,
                                        color: '#546e7a',
                                        fontFamily: 'Montserrat, sans-serif'
                                    }}
                                >
                                    {selectedFilm.description}
                                </Typography>
                            )}

                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    mb: 2,
                                    color: '#051937',
                                    fontFamily: 'Poppins, sans-serif'
                                }}
                            >
                                Available Screenings:
                            </Typography>

                            {selectedFilm.seances && selectedFilm.seances.length > 0 ? (
                                <Grid container spacing={2}>
                                    {selectedFilm.seances.map((screening) => {
                                        const screeningSalle = salles.find(s => s.id === screening.salle_id);
                                        const screeningTime = new Date(screening.heure);

                                        return (
                                            <Grid item xs={12} sm={6} md={4} key={screening.id}>
                                                <Paper
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: 2,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        border: '1px solid #e0e0e0',
                                                        '&:hover': {
                                                            borderColor: '#1976d2',
                                                            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                                                            transform: 'translateY(-4px)'
                                                        }
                                                    }}
                                                    onClick={() => handleSeanceSelect(screening)}
                                                >
                                                    <Box sx={{ display: 'flex', mb: 1 }}>
                                                        <EventIcon sx={{ color: '#1976d2', mr: 1 }} />
                                                        <Typography
                                                            variant="subtitle1"
                                                            sx={{
                                                                fontWeight: 600,
                                                                color: '#051937',
                                                                fontFamily: 'Poppins, sans-serif'
                                                            }}
                                                        >
                                                            {screeningTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </Typography>
                                                    </Box>

                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: '#616161',
                                                            fontFamily: 'Montserrat, sans-serif',
                                                            mb: 1
                                                        }}
                                                    >
                                                        Theater: {screeningSalle?.nom || 'Unknown'}
                                                    </Typography>

                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontWeight: 500,
                                                                color: '#1976d2',
                                                                fontFamily: 'Montserrat, sans-serif'
                                                            }}
                                                        >
                                                            Base price: €{screening.prix_base?.toFixed(2) || '10.00'}
                                                        </Typography>

                                                        <Chip
                                                            label={screeningSalle?.capacity ? `${screeningSalle.capacity} seats` : 'Unknown capacity'}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: '#e0f7fa',
                                                                color: '#0097a7',
                                                                fontFamily: 'Montserrat, sans-serif',
                                                                fontSize: '0.7rem'
                                                            }}
                                                        />
                                                    </Box>
                                                </Paper>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 4, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                                    <Typography
                                        variant="body1"
                                        sx={{ color: '#546e7a', fontFamily: 'Montserrat, sans-serif' }}
                                    >
                                        No screenings available for this film.
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>
                )}
            </Box>
        );
    };
    // Render the seat selection step
    const renderSeatSelection = () => {
        if (!selectedSeance || !selectedSalle) {
            return (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6">Please select a screening first.</Typography>
                    <Button onClick={() => setActiveStep(1)} sx={{ mt: 2 }}>
                        Select Screening
                    </Button>
                </Box>
            );
        }

        // Number of seats per row
        const seatsPerRow = 10;
        // Calculate number of rows
        const rows = Math.ceil(selectedSalle.capacity / seatsPerRow);

        return (
            <Box>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                    sx={{
                        mb: 3,
                        fontFamily: 'Montserrat, sans-serif',
                        textTransform: 'none',
                    }}
                >
                    Back to screenings
                </Button>

                <Box sx={{
                    border: '2px solid #1976d2',
                    borderRadius: '8px',
                    p: 3,
                    mb: 4,
                    backgroundColor: '#f5f8ff'
                }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <EventIcon sx={{ color: '#1976d2', mr: 1 }} />
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        color: '#051937',
                                        fontFamily: 'Poppins, sans-serif'
                                    }}
                                >
                                    {selectedFilm?.nom} - {new Date(selectedSeance.heure).toLocaleString([], {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                                </Typography>
                            </Box>

                            <Typography
                                variant="body1"
                                sx={{
                                    color: '#546e7a',
                                    fontFamily: 'Montserrat, sans-serif',
                                    mb: 1
                                }}
                            >
                                Theater: {selectedSalle?.nom}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, alignItems: 'center' }}>
                            <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                                <InputLabel id="seat-type-label">Ticket Type</InputLabel>
                                <Select
                                    labelId="seat-type-label"
                                    id="seat-type"
                                    value={selectedSeatType}
                                    onChange={handleSeatTypeChange}
                                    label="Ticket Type"
                                    sx={{ fontFamily: 'Montserrat, sans-serif' }}
                                >
                                    <MenuItem value="normal" sx={{ fontFamily: 'Montserrat, sans-serif' }}>Normal (€{ticketPrices.normal.toFixed(2)})</MenuItem>
                                    <MenuItem value="reduit" sx={{ fontFamily: 'Montserrat, sans-serif' }}>Reduced (€{ticketPrices.reduit.toFixed(2)})</MenuItem>
                                    <MenuItem value="enfant" sx={{ fontFamily: 'Montserrat, sans-serif' }}>Child (€{ticketPrices.enfant.toFixed(2)})</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>

                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Box
                        sx={{
                            width: '80%',
                            height: '20px',
                            backgroundColor: '#1976d2',
                            borderRadius: '10px',
                            mx: 'auto',
                            mb: 3,
                            boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                color: 'white',
                                fontWeight: 600,
                                fontFamily: 'Montserrat, sans-serif'
                            }}
                        >
                            SCREEN
                        </Typography>
                    </Box>

                    <Typography
                        variant="subtitle1"
                        sx={{
                            mb: 2,
                            fontFamily: 'Poppins, sans-serif',
                            color: '#546e7a'
                        }}
                    >
                        Select your seats (Current selection: {selectedSeatType})
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, mb: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{
                                    width: 20,
                                    height: 20,
                                    backgroundColor: '#e0e0e0',
                                    borderRadius: 1,
                                    mr: 1
                                }} />
                                <Typography variant="caption" sx={{ fontFamily: 'Montserrat, sans-serif' }}>Unavailable</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{
                                    width: 20,
                                    height: 20,
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #1976d2',
                                    borderRadius: 1,
                                    mr: 1
                                }} />
                                <Typography variant="caption" sx={{ fontFamily: 'Montserrat, sans-serif' }}>Available</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{
                                    width: 20,
                                    height: 20,
                                    backgroundColor: '#1976d2',
                                    borderRadius: 1,
                                    mr: 1
                                }} />
                                <Typography variant="caption" sx={{ fontFamily: 'Montserrat, sans-serif' }}>Selected</Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Seat grid */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                        {Array.from({ length: rows }).map((_, rowIndex) => (
                            <Box key={rowIndex} sx={{ display: 'flex', gap: 1 }}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        width: 20,
                                        lineHeight: '32px',
                                        fontFamily: 'Montserrat, sans-serif',
                                        fontWeight: 600
                                    }}
                                >
                                    {String.fromCharCode(65 + rowIndex)}
                                </Typography>

                                {Array.from({ length: seatsPerRow }).map((_, seatIndex) => {
                                    const seatNumber = rowIndex * seatsPerRow + seatIndex + 1;
                                    const isAvailable = availableSeats.includes(seatNumber);
                                    const isSelected = selectedSeats.some(seat => parseInt(seat.id) === seatNumber);

                                    return (
                                        <Box
                                            key={seatIndex}
                                            onClick={() => isAvailable && handleSeatSelect(seatNumber)}
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: isSelected ? '#1976d2' : (isAvailable ? '#ffffff' : '#e0e0e0'),
                                                border: isAvailable && !isSelected ? '1px solid #1976d2' : 'none',
                                                borderRadius: 1,
                                                cursor: isAvailable ? 'pointer' : 'default',
                                                transition: 'all 0.2s ease',
                                                color: isSelected ? '#ffffff' : '#333333',
                                                '&:hover': {
                                                    backgroundColor: isAvailable && !isSelected ? '#e3f2fd' : (isSelected ? '#1565c0' : '#e0e0e0'),
                                                    transform: isAvailable ? 'scale(1.1)' : 'none'
                                                }
                                            }}
                                        >
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    fontWeight: 600,
                                                    fontSize: '0.7rem',
                                                    fontFamily: 'Montserrat, sans-serif'
                                                }}
                                            >
                                                {seatNumber}
                                            </Typography>
                                        </Box>
                                    );
                                })}
                            </Box>
                        ))}
                    </Box>

                    <Box sx={{ mt: 4 }}>
                        <Button
                            variant="contained"
                            disabled={selectedSeats.length === 0}
                            onClick={handleNext}
                            sx={{
                                fontFamily: 'Montserrat, sans-serif',
                                textTransform: 'none',
                                borderRadius: 2
                            }}
                        >
                            Continue to Checkout
                        </Button>
                    </Box>
                </Box>
            </Box>
        );
    };

    // Render the confirmation step
// Render the confirmation step
    const renderConfirmation = () => {
        if (selectedSeats.length === 0 || !selectedFilm || !selectedSeance || !selectedSalle) {
            return (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6">Please complete your seat selection first.</Typography>
                    <Button onClick={() => setActiveStep(2)} sx={{ mt: 2 }}>
                        Back to Seat Selection
                    </Button>
                </Box>
            );
        }

        return (
            <Box>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                    sx={{
                        mb: 3,
                        fontFamily: 'Montserrat, sans-serif',
                        textTransform: 'none',
                    }}
                >
                    Back to seat selection
                </Button>

                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                        border: '1px solid #e0e0e0',
                        mb: 4
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            mb: 3,
                            fontWeight: 600,
                            fontFamily: 'Poppins, sans-serif',
                            color: '#051937'
                        }}
                    >
                        Booking Summary
                    </Typography>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                <Box sx={{
                                    width: { xs: '80px', sm: '120px' },
                                    height: 'auto',
                                    overflow: 'hidden',
                                    borderRadius: 2,
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                }}>
                                    <img
                                        src={selectedFilm.poster || 'https://via.placeholder.com/300x450?text=No+Poster'}
                                        alt={selectedFilm.nom}
                                        style={{ width: '100%', height: 'auto' }}
                                    />
                                </Box>

                                <Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 600,
                                            mb: 0.5,
                                            fontFamily: 'Poppins, sans-serif',
                                            color: '#051937'
                                        }}
                                    >
                                        {selectedFilm.nom}
                                    </Typography>

                                    <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                                        {selectedFilm.genre && (
                                            <Chip
                                                label={selectedFilm.genre}
                                                size="small"
                                                sx={{
                                                    backgroundColor: '#fff8e1',
                                                    color: '#ff8f00',
                                                    fontFamily: 'Montserrat, sans-serif',
                                                    fontSize: '0.75rem'
                                                }}
                                            />
                                        )}

                                        {selectedFilm.duree && (
                                            <Chip
                                                label={`${selectedFilm.duree} min`}
                                                size="small"
                                                sx={{
                                                    backgroundColor: '#e3f2fd',
                                                    color: '#0277bd',
                                                    fontFamily: 'Montserrat, sans-serif',
                                                    fontSize: '0.75rem'
                                                }}
                                            />
                                        )}
                                    </Box>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                            mb: 0.5,
                                            color: '#546e7a',
                                            fontFamily: 'Montserrat, sans-serif'
                                        }}
                                    >
                                        <EventIcon fontSize="small" sx={{ color: '#1976d2' }} />
                                        {new Date(selectedSeance.heure).toLocaleString([], {
                                            weekday: 'long',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                            color: '#546e7a',
                                            fontFamily: 'Montserrat, sans-serif'
                                        }}
                                    >
                                        <EventSeatIcon fontSize="small" sx={{ color: '#1976d2' }} />
                                        {selectedSalle.nom}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ mb: 3 }} />

                            <Typography
                                variant="h6"
                                sx={{
                                    mb: 2,
                                    fontWeight: 600,
                                    fontFamily: 'Poppins, sans-serif',
                                    color: '#051937',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                <ConfirmationNumberIcon sx={{ color: '#1976d2' }} />
                                Tickets
                            </Typography>

                            {selectedSeats.map((seat, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 1,
                                        p: 1,
                                        borderRadius: 1,
                                        backgroundColor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.02)' : 'transparent'
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontFamily: 'Montserrat, sans-serif',
                                            color: '#546e7a'
                                        }}
                                    >
                                        Seat {seat.id} - {seat.type.charAt(0).toUpperCase() + seat.type.slice(1)}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 600,
                                            fontFamily: 'Montserrat, sans-serif',
                                            color: '#051937'
                                        }}
                                    >
                                        €{ticketPrices[seat.type].toFixed(2)}
                                    </Typography>
                                </Box>
                            ))}

                            <Divider sx={{ my: 2 }} />

                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    p: 2,
                                    borderRadius: 2,
                                    backgroundColor: '#f5f8ff',
                                    mb: 2
                                }}
                            >
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 600,
                                        fontFamily: 'Poppins, sans-serif',
                                        color: '#051937'
                                    }}
                                >
                                    Total
                                </Typography>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        fontFamily: 'Montserrat, sans-serif',
                                        color: '#1976d2'
                                    }}
                                >
                                    €{calculateTotal().toFixed(2)}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                    border: '1px solid #e0e0e0',
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        mb: 2,
                                        fontWeight: 600,
                                        fontFamily: 'Poppins, sans-serif',
                                        color: '#051937'
                                    }}
                                >
                                    Payment Details
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Card Holder Name"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            InputProps={{
                                                sx: { fontFamily: 'Montserrat, sans-serif' }
                                            }}
                                            InputLabelProps={{
                                                sx: { fontFamily: 'Montserrat, sans-serif' }
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            label="Card Number"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            InputProps={{
                                                sx: { fontFamily: 'Montserrat, sans-serif' }
                                            }}
                                            InputLabelProps={{
                                                sx: { fontFamily: 'Montserrat, sans-serif' }
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <TextField
                                            label="Expiry Date"
                                            fullWidth
                                            variant="outlined"
                                            placeholder="MM/YY"
                                            size="small"
                                            InputProps={{
                                                sx: { fontFamily: 'Montserrat, sans-serif' }
                                            }}
                                            InputLabelProps={{
                                                sx: { fontFamily: 'Montserrat, sans-serif' }
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <TextField
                                            label="CVC"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            InputProps={{
                                                sx: { fontFamily: 'Montserrat, sans-serif' }
                                            }}
                                            InputLabelProps={{
                                                sx: { fontFamily: 'Montserrat, sans-serif' }
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                display: 'block',
                                                mb: 2,
                                                fontFamily: 'Montserrat, sans-serif',
                                                color: '#757575'
                                            }}
                                        >
                                            By proceeding with your payment, you agree to our Terms of Service and Cancellation Policy.
                                        </Typography>

                                        <Button
                                            variant="contained"
                                            fullWidth
                                            disabled={loading}
                                            onClick={handleSubmitBooking}
                                            sx={{
                                                py: 1.5,
                                                fontFamily: 'Montserrat, sans-serif',
                                                fontWeight: 600,
                                                textTransform: 'none',
                                                borderRadius: 2,
                                                backgroundColor: '#00e5ff',
                                                color: '#051937',
                                                '&:hover': {
                                                    backgroundColor: '#00c4d8',
                                                }
                                            }}
                                        >
                                            {loading ? (
                                                <CircularProgress size={24} />
                                            ) : (
                                                `Pay €${calculateTotal().toFixed(2)}`
                                            )}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        );
    };

    // Render different steps based on active step
    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return renderFilmSelection();
            case 1:
                return renderScreeningSelection();
            case 2:
                return renderSeatSelection();
            case 3:
                return renderConfirmation();
            default:
                return 'Unknown step';
        }
    };

    return (
        <Box
            sx={{
                background: 'linear-gradient(to right,rgb(245, 247, 250) 0%,rgb(250, 252, 255) 100%)',
                minHeight: '100vh',
                pt: 4,
                pb: 8
            }}
        >
            <Container maxWidth="lg">
                <Box sx={{ mb: 5, textAlign: 'center' }}>
                    <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                            fontWeight: 700,
                            mb: 2,
                            background: 'linear-gradient(90deg, #0d47a1 0%, #1976d2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontFamily: 'Montserrat, sans-serif'
                        }}
                    >
                        Book Your Tickets
                    </Typography>

                    <Typography
                        variant="h6"
                        sx={{
                            color: '#546e7a',
                            maxWidth: '700px',
                            mx: 'auto',
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: 400
                        }}
                    >
                        Follow the steps below to book your cinema experience
                    </Typography>
                </Box>

                <Box sx={{ mb: 5 }}>
                    <Stepper
                        activeStep={activeStep}
                        alternativeLabel
                        sx={{
                            '& .MuiStepLabel-label': {
                                fontFamily: 'Montserrat, sans-serif',
                                mt: 1
                            }
                        }}
                    >
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>

                <Box sx={{ mt: 4 }}>
                    {getStepContent(activeStep)}
                </Box>
            </Container>

            {/* Success Dialog */}
            <Dialog
                open={successDialogOpen}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ textAlign: 'center', fontFamily: 'Poppins, sans-serif', pt: 4 }}>
                    <CheckCircleIcon sx={{ color: '#4caf50', fontSize: '4rem', mb: 2 }} />
                    <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                        Booking Confirmed!
                    </Typography>
                </DialogTitle>

                <DialogContent>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Typography
                            variant="body1"
                            sx={{
                                mb: 3,
                                fontFamily: 'Montserrat, sans-serif'
                            }}
                        >
                            Your booking has been successfully confirmed. Your reference number is:
                        </Typography>

                        <Typography
                            variant="h5"
                            sx={{
                                mb: 3,
                                fontWeight: 700,
                                fontFamily: 'Montserrat, sans-serif',
                                color: '#1976d2',
                                p: 2,
                                borderRadius: 2,
                                backgroundColor: '#f5f8ff',
                                display: 'inline-block'
                            }}
                        >
                            {bookingReference}
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                fontFamily: 'Montserrat, sans-serif',
                                color: '#546e7a'
                            }}
                        >
                            A confirmation email has been sent to your registered email address.
                        </Typography>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        onClick={handleReset}
                        sx={{
                            fontFamily: 'Montserrat, sans-serif',
                            textTransform: 'none',
                            borderRadius: 2,
                            px: 4
                        }}
                    >
                        Book Another Ticket
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ReservationPage;