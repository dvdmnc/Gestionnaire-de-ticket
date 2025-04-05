import React, { useState, useEffect } from 'react';
import BookingList from './BookingList';
import BookingForm from './BookingForm';
import { Booking, Ticket } from '../../CRUD/Types';
import { Container, Button, Modal, Box, Typography, Paper } from '@mui/material';
import { getBookings, createBooking, updateBooking, deleteBooking } from '../../CRUD/BookingController';
import { useNotifications } from '@toolpad/core';
import AddIcon from '@mui/icons-material/Add';
import BookOnlineIcon from '@mui/icons-material/BookOnline';

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
             <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                mb: 3,
                                borderRadius: '12px',
                                border: '1px solid #e0e0e0',
                                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <BookOnlineIcon sx={{ color: '#3f51b5', mr: 2, fontSize: 28 }} />
                                <Typography variant="h5" sx={{ fontWeight: 600, color: '#232323' }}>
                                Booking Management
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setOpen(true)}
                                sx={{
                                    backgroundColor: '#3f51b5',
                                    color: 'white',
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    px: 3,
                                    '&:hover': {
                                        backgroundColor: '#303f9f'
                                    }
                                }}
                            >
                               Create New Booking
                            </Button>
                        </Paper>
            <BookingList bookings={bookings} onEdit={handleEdit} onDelete={handleDelete} />
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ p: 4 }}>
                    <BookingForm existingBooking={selectedBooking || undefined} onSave={handleSave} onClose={handleClose}/>
                </Box>
            </Modal>
        </Container>
    );
};

export default BookingManager;
