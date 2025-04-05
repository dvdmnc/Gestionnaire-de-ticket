import React, { useState, useEffect } from 'react';
import BookingList from './BookingList';
import BookingForm from './BookingForm';
import { Booking, BookingWithTickets } from '../../CRUD/Types';
import { Container, Button, Modal, Box, Typography, Paper } from '@mui/material';
import { getBookings, createBooking, updateBooking, deleteBooking } from '../../CRUD/BookingController';
import { useNotifications } from '@toolpad/core';

const BookingManager: React.FC = () => {
    const [bookings, setBookings] = useState<BookingWithTickets[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<BookingWithTickets | null>(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const notifications = useNotifications();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const fetchedBookings = await getBookings();
            setBookings(fetchedBookings);
        } catch (error) {
            notifications.show('Failed to fetch bookings', { severity: 'error', autoHideDuration: 3000 });
            console.error("Error fetching bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (booking: BookingWithTickets) => {
        setSelectedBooking(booking);
        setOpen(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteBooking(id);
            notifications.show('Booking deleted successfully', { severity: 'success', autoHideDuration: 2000 });
            fetchBookings();
        } catch (error) {
            notifications.show('Failed to delete booking', { severity: 'error', autoHideDuration: 3000 });
            console.error("Error deleting booking:", error);
        }
    };

    const handleClose = () => {
        setSelectedBooking(null);
        setOpen(false);
    };

    const handleSave = async (bookingWithTickets: BookingWithTickets) => {
        try {
            if (bookingWithTickets.id) {
                // Update existing booking
                await updateBooking(bookingWithTickets);
                notifications.show('Booking updated successfully', { severity: 'success', autoHideDuration: 2000 });
            } else {
                // Create new booking
                await createBooking(bookingWithTickets);
                notifications.show('Booking created successfully', { severity: 'success', autoHideDuration: 2000 });
            }
            fetchBookings();
            handleClose();
        } catch (error) {
            notifications.show('Failed to save booking', { severity: 'error', autoHideDuration: 3000 });
            console.error("Error saving booking:", error);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
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
                <Typography variant="h4">Booking Management</Typography>
                <Button
                    variant="contained"
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

            <BookingList
                bookings={bookings}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={loading}
            />

            <Modal
                open={open}
                onClose={handleClose}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box sx={{
                    width: '90%',
                    maxWidth: '900px',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                }}>
                    <BookingForm
                        existingBooking={selectedBooking || undefined}
                        onSave={handleSave}
                        onClose={handleClose}
                    />
                </Box>
            </Modal>
        </Container>
    );
};

export default BookingManager;