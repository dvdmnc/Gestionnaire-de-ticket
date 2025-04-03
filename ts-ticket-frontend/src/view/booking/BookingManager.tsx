import React, { useState, useEffect } from 'react';
import BookingList from './BookingList';
import BookingForm from './BookingForm';
import { Booking, Ticket } from '../../CRUD/Types';
import { Container, Button, Modal, Box, Typography } from '@mui/material';
import { getBookings, createBooking, updateBooking, deleteBooking } from '../../CRUD/BookingController';
import { useNotifications } from '@toolpad/core';

const BookingManager: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [open, setOpen] = useState(false);
    const notifications = useNotifications();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        const fetchedBookings = await getBookings();
        setBookings(fetchedBookings);
    };

    const handleEdit = (booking: Booking) => {
        setSelectedBooking(booking);
        setOpen(true);
    };

    const handleDelete = async (id: number) => {
        await deleteBooking(id);
        notifications.show('Booking deleted successfully', { severity: 'success', autoHideDuration: 2000 });
        fetchBookings();
    };

    const handleClose = () => {
        setSelectedBooking(null);
        setOpen(false);
    };

    const handleSave = async (booking: Booking, tickets: Ticket[]) => {
        if (booking.id) {
            await updateBooking(booking, tickets);
            notifications.show('Booking updated successfully', { severity: 'success', autoHideDuration: 2000 });
        } else {
            await createBooking(booking, tickets);
            notifications.show('Booking created successfully', { severity: 'success', autoHideDuration: 2000 });
        }
        fetchBookings();
        handleClose();
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Booking Management</Typography>
            <Button variant="contained" onClick={() => setOpen(true)} sx={{ my: 2 }}>
                Create New Booking
            </Button>
            <BookingList bookings={bookings} onEdit={handleEdit} onDelete={handleDelete} />
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ p: 4 }}>
                    <BookingForm existingBooking={selectedBooking || undefined} onSave={handleSave} />
                </Box>
            </Modal>
        </Container>
    );
};

export default BookingManager;
