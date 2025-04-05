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
    IconButton
} from '@mui/material';
import { Booking, Ticket, Seance } from '../../CRUD/Types.ts';
import { getSeances } from "../../CRUD/SeanceController.ts";
import CloseIcon from '@mui/icons-material/Close';

interface Props {
    existingBooking?: Booking;
    onSave: (booking: Booking, tickets: Ticket[]) => void;
    onClose?: () => void;
}

const BookingForm: React.FC<Props> = ({ existingBooking, onSave, onClose }) => {
    const [booking, setBooking] = useState<Booking>({
        user_id: '',
        seance_id: 0,
        date_reservation: new Date().toISOString(),
    } as Booking);

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [seances, setSeances] = useState<Seance[]>([]);

    useEffect(() => {
        getSeances().then(setSeances);

        if (existingBooking) {
            setBooking(existingBooking);
        }
    }, [existingBooking]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setBooking((prev) => ({
            ...prev,
            [name as string]: value,
        }));
    };

    const handleTicketChange = (index: number, field: string, value: string | number) => {
        setTickets((prevTickets) => {
            const updatedTickets = [...prevTickets];
            updatedTickets[index] = { ...updatedTickets[index], [field]: value };
            return updatedTickets;
        });
    };

    const addTicket = () => {
        setTickets([...tickets, { reservation_id: booking.id, type: '', num_siege: '', price: 0 } as Ticket]);
    };

    const removeTicket = (index: number) => {
        setTickets(tickets.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(booking, tickets);
    };

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
    <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <Typography variant="h6" gutterBottom>
                {existingBooking ? 'Edit Booking' : 'Create New Booking'}
                </Typography>
                {onClose && (
                        <IconButton
                        onClick={onClose}
                        >
                            <CloseIcon />
                        </IconButton>
                    )}
            </Box>
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    <FormControl fullWidth>
    <InputLabel>Screening</InputLabel>
    <Select name="seance_id" value={booking.seance_id || 0} onChange={handleChange} required>
    {seances.map((screening) => (
            <MenuItem key={screening.id} value={screening.id}>
        {screening.heure} - {screening.film_id}
        </MenuItem>
))}
    </Select>
    </FormControl>

    {/* Tickets Section */}
    <Typography variant="h6">Tickets</Typography>
    {tickets.map((ticket, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 2 }}>
        <TextField
            label="Seat Number"
        value={ticket.num_siege}
        onChange={(e) => handleTicketChange(index, 'num_siege', e.target.value)}
        required
        />
        <TextField
            label="Type"
        value={ticket.type}
        onChange={(e) => handleTicketChange(index, 'type', e.target.value)}
        required
        />
        <TextField
            label="Price (€)"
        type="number"
        value={ticket.price}
        onChange={(e) => handleTicketChange(index, 'price', parseFloat(e.target.value))}
        required
        />
        <Button onClick={() => removeTicket(index)}>Remove</Button>
    </Box>
    ))}
    <Button onClick={addTicket} variant="contained">Add Ticket</Button>

    <Button type="submit" variant="contained" color="primary">
        Save Booking
    </Button>
    </Box>
    </Paper>
);
};

export default BookingForm;
