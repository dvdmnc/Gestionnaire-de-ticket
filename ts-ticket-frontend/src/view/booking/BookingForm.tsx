import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Paper,
    Box,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
    CircularProgress
} from '@mui/material';
import { Booking, Ticket, Seance, types, Salle, BookingWithTickets, User } from '../../CRUD/Types.ts';
import { getSeances } from "../../CRUD/SeanceController.ts";
import { getSalles } from "../../CRUD/SalleController.ts";
import { getUsers } from "../../CRUD/UserController.ts";
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
    existingBooking?: BookingWithTickets;
    onSave: (bookingWithTickets: BookingWithTickets) => void;
    onClose?: () => void;
}

const BookingForm: React.FC<Props> = ({ existingBooking, onSave, onClose }) => {
    // Use a ref to prevent multiple clicks
    const isAddingTicket = React.useRef(false);
    const [booking, setBooking] = useState<Booking>({
        user_id: '',
        seance_id: 0,
        date_reservation: new Date().toISOString(),
    } as Booking);

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [seances, setSeances] = useState<Seance[]>([]);
    const [salles, setSalles] = useState<Salle[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedSeance, setSelectedSeance] = useState<Seance | null>(null);
    const [selectedSalle, setSelectedSalle] = useState<Salle | null>(null);
    const [availableSeats, setAvailableSeats] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingUsers, setLoadingUsers] = useState<boolean>(false);

    // Available ticket types from the Types.ts file
    const ticketTypes: types[] = ['normal', 'reduit', 'enfant'];

    // Define ticket prices based on type
    const ticketPrices = {
        normal: 10.00,
        reduit: 7.50,
        enfant: 5.00
    };

    useEffect(() => {
        // Fetch seances, salles, and users when component mounts
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setLoadingUsers(true);

                const [seancesData, sallesData, usersData] = await Promise.all([
                    getSeances(),
                    getSalles(),
                    getUsers()
                ]);

                setSeances(seancesData);
                setSalles(sallesData);
                setUsers(usersData);
                console.log('Fetched seances:', sallesData);
                if (existingBooking) {
                    console.log("Existing booking data:", existingBooking);

                    // Set booking data
                    setBooking({
                        id: existingBooking.id,
                        user_id: existingBooking.user_id,
                        seance_id: existingBooking.seance_id,
                        date_reservation: existingBooking.date_reservation
                    });

                    // Set tickets data - make a deep copy to ensure we're not dealing with references
                    if (existingBooking.tickets && existingBooking.tickets.length > 0) {
                        console.log("Setting tickets:", existingBooking.tickets);
                        const ticketsCopy = existingBooking.tickets.map(ticket => ({...ticket}));
                        setTickets(ticketsCopy);
                    }

                    // Find the selected seance based on the booking's seance_id
                    const seance = seancesData.find(s => s.id === existingBooking.seance_id);
                    if (seance) {
                        setSelectedSeance(seance);

                        // Find the corresponding salle
                        const salle = sallesData.find(s => s.id === seance.salle_id);
                        if (salle) {
                            setSelectedSalle(salle);
                            fetchAvailableSeats(seance.id, salle, existingBooking.tickets);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching initial data:", error);
            } finally {
                setIsLoading(false);
                setLoadingUsers(false);
            }
        };

        fetchData();
    }, [existingBooking]);

    // Fetch available seats whenever the selected seance changes
    useEffect(() => {
        if (selectedSeance && selectedSalle) {
            fetchAvailableSeats(selectedSeance.id, selectedSalle, tickets);
        }
    }, [selectedSeance, selectedSalle]);

    // Fetch available seats for a given seance
    const fetchAvailableSeats = async (seanceId: number, salle: Salle, existingTickets: Ticket[] = []) => {
        setIsLoading(true);
        try {
            // This would ideally be a dedicated API endpoint
            // For now, we'll mock it by fetching all tickets for the seance
            const response = await axios.get(`http://localhost:5000/tickets?seance_id=${seanceId}`);
            const takenTickets: Ticket[] = response.data;

            // Generate all seat numbers from 1 to capacity
            const allSeatNumbers = Array.from({ length: salle.capacity }, (_, i) => (i + 1).toString());

            // Get seats that are taken by other bookings (not including our current booking's seats)
            const existingTicketSeats = existingTickets.map(ticket => ticket.num_siege);
            const takenSeatNumbers = takenTickets
                .filter(ticket => !existingTicketSeats.includes(ticket.num_siege))
                .map(ticket => ticket.num_siege);

            // Filter out seats that are already taken by other bookings
            const available = allSeatNumbers.filter(seatNum => !takenSeatNumbers.includes(seatNum));

            console.log("Available seats:", available);
            console.log("Existing ticket seats:", existingTicketSeats);

            setAvailableSeats(available);
        } catch (error) {
            console.error("Error fetching available seats:", error);
            // If the API fails, fallback to showing all seats
            if (selectedSalle) {
                const allSeatNumbers = Array.from({ length: selectedSalle.capacity }, (_, i) => (i + 1).toString());
                setAvailableSeats(allSeatNumbers);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;

        if (name === 'seance_id') {
            // Find the selected seance
            const seance = seances.find(s => s.id === value);
            setSelectedSeance(seance || null);

            if (seance) {
                // Find the corresponding salle
                const salle = salles.find(s => s.id === seance.salle_id);
                setSelectedSalle(salle || null);
            } else {
                setSelectedSalle(null);
            }
        }

        setBooking((prev) => ({
            ...prev,
            [name as string]: value,
        }));
    };

    const handleTicketChange = (index: number, field: string, value: string | number) => {
        setTickets((prevTickets) => {
            const updatedTickets = [...prevTickets];

            // If changing ticket type, automatically set the price
            if (field === 'type') {
                const type = value as types;
                updatedTickets[index] = {
                    ...updatedTickets[index],
                    [field]: value,
                    price: ticketPrices[type]
                };
            } else {
                updatedTickets[index] = { ...updatedTickets[index], [field]: value };
            }

            return updatedTickets;
        });
    };

    // Prevent multiple ticket adds with a debounce mechanism
    const addTicket = () => {
        // Check if button is already being processed
        if (isAddingTicket.current) return;

        isAddingTicket.current = true;

        // Default to normal ticket type and set its price automatically
        setTickets(prevTickets => [...prevTickets, {
            reservation_id: booking.id,
            type: 'normal',
            num_siege: '',
            price: ticketPrices.normal
        } as Ticket]);

        // Reset flag after a short delay
        setTimeout(() => {
            isAddingTicket.current = false;
        }, 300);
    };

    const removeTicket = (index: number) => {
        setTickets(tickets.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveBooking();
    };

    const saveBooking = () => {
        // Validate that booking has a seance_id and user_id
        if (!booking.seance_id) {
            alert('Please select a screening');
            return;
        }

        if (!booking.user_id) {
            alert('Please select a user');
            return;
        }

        // Validate that there's at least one ticket
        if (tickets.length === 0) {
            alert('Please add at least one ticket');
            return;
        }

        // Validate that all tickets have a seat number and type
        const invalidTickets = tickets.filter(ticket => !ticket.num_siege || !ticket.type);
        if (invalidTickets.length > 0) {
            alert('Please fill in all ticket information');
            return;
        }

        // Create a BookingWithTickets object with a clean copy of the tickets array
        const bookingWithTickets: BookingWithTickets = {
            ...booking,
            tickets: tickets.map(ticket => ({...ticket}))  // Create a new copy of each ticket
        };

        console.log("Saving booking with tickets:", bookingWithTickets);

        // Call the onSave function with the booking and tickets
        onSave(bookingWithTickets);
    };

    const getFormattedDate = (date: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        return new Date(date).toLocaleDateString('fr-FR', options);
    };

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" gutterBottom>
                    {existingBooking ? 'Edit Booking' : 'Create New Booking'}
                </Typography>
                {onClose && (
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                )}
            </Box>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* User Selection */}
                <FormControl fullWidth>
                    <InputLabel>User</InputLabel>
                    <Select
                        name="user_id"
                        value={booking.user_id || ''}
                        onChange={handleChange}
                        required
                        disabled={loadingUsers}
                    >
                        {loadingUsers ? (
                            <MenuItem value="">
                                <CircularProgress size={20} /> Loading users...
                            </MenuItem>
                        ) : (
                            users.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                    {user.nom} ({user.email})
                                </MenuItem>
                            ))
                        )}
                    </Select>
                </FormControl>

                {/* Screening Selection */}
                <FormControl fullWidth>
                    <InputLabel>Screening</InputLabel>
                    <Select name="seance_id" value={booking.seance_id || 0} onChange={handleChange} required>
                        {seances.map((screening) => {
                            // Find the corresponding salle to show its name
                            const salle = salles.find(s => s.id === screening.salle_id);
                            return (
                                <MenuItem key={screening.id} value={screening.id}>
                                    {getFormattedDate(screening.heure)} - Salle: {salle?.nom || screening.salle_id}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>

                {/* Show theater information if selected */}
                {selectedSalle && (
                    <Box sx={{ mt: 1, mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Selected Theater: {selectedSalle.nom}
                        </Typography>
                        <Typography variant="body2">
                            Capacity: {selectedSalle.capacity} seats
                            {availableSeats.length > 0 && ` (${availableSeats.length} available)`}
                        </Typography>
                    </Box>
                )}

                {/* Tickets Section */}
                <Typography variant="h6">Tickets</Typography>
                {tickets.map((ticket, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel>Seat Number</InputLabel>
                            <Select
                                value={ticket.num_siege || ''}
                                onChange={(e) => handleTicketChange(index, 'num_siege', e.target.value as string)}
                                required
                                disabled={isLoading || availableSeats.length === 0}
                            >
                                {isLoading ? (
                                    <MenuItem value="">
                                        <CircularProgress size={20} /> Loading...
                                    </MenuItem>
                                ) : (
                                    [...availableSeats, ...(ticket.num_siege ? [ticket.num_siege] : [])]
                                        // Filter out seats that are already selected in other tickets
                                        .filter(seat => !tickets.some((t, i) => i !== index && t.num_siege === seat))
                                        // Remove duplicates
                                        .filter((seat, i, arr) => arr.indexOf(seat) === i)
                                        // Sort numerically
                                        .sort((a, b) => parseInt(a) - parseInt(b))
                                        .map((seat) => (
                                            <MenuItem key={seat} value={seat}>
                                                Seat {seat}
                                            </MenuItem>
                                        ))
                                )}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={ticket.type || 'normal'}
                                onChange={(e) => handleTicketChange(index, 'type', e.target.value as types)}
                                required
                            >
                                {ticketTypes.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)} {/* Capitalize first letter */}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Price (€)"
                            type="number"
                            value={ticket.price}
                            onChange={(e) => handleTicketChange(index, 'price', parseFloat(e.target.value))}
                            InputProps={{
                                readOnly: false,  // You can set to true if you don't want manual overrides
                            }}
                            required
                        />
                        <Button
                            onClick={() => removeTicket(index)}
                            variant="outlined"
                            color="error"
                            sx={{ minWidth: '100px' }}
                        >
                            Remove
                        </Button>
                    </Box>
                ))}
                <Button
                    onClick={(e) => {
                        e.preventDefault(); // Prevent form submission
                        addTicket();
                    }}
                    variant="contained"
                    color="secondary"
                    sx={{ alignSelf: 'flex-start', mb: 2 }}
                    disabled={isLoading || !selectedSalle || availableSeats.length === 0 || (tickets.length >= availableSeats.length) || isAddingTicket.current}
                    type="button" // Explicitly set type to button to prevent form submission
                >
                    Add Ticket
                </Button>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Typography variant="subtitle1">
                        Total price: {tickets.reduce((sum, ticket) => sum + ticket.price, 0).toFixed(2)} €
                    </Typography>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={saveBooking}
                        disabled={tickets.length === 0 || !booking.user_id || !booking.seance_id}
                    >
                        Save Booking
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default BookingForm;