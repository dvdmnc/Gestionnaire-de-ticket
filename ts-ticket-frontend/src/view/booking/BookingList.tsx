import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TablePagination,
    Box,
    Chip,
    CircularProgress,
    Typography
} from '@mui/material';
import { BookingWithTickets } from '../../CRUD/Types.ts';
import DeleteButton from "../DeleteButton.tsx";

interface Props {
    bookings: BookingWithTickets[];
    onEdit: (booking: BookingWithTickets) => void;
    onDelete: (id: number) => void;
    loading?: boolean;
}

const BookingList: React.FC<Props> = ({ bookings, onEdit, onDelete, loading = false }) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    const calculateTotalPrice = (booking: BookingWithTickets) => {
        if (!booking.tickets || booking.tickets.length === 0) return 0;
        return booking.tickets.reduce((total, ticket) => total + ticket.price, 0);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (bookings.length === 0) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1">No bookings found</Typography>
            </Paper>
        );
    }

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', mb: 4, borderRadius: '12px', border: '1px solid #e0e0e0' }}>
            <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Screening ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Tickets</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Total Price</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookings
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((booking) => (
                                <TableRow key={booking.id} hover>
                                    <TableCell>{booking.id}</TableCell>
                                    <TableCell>{booking.seance_id}</TableCell>
                                    <TableCell>{booking.user_id}</TableCell>
                                    <TableCell>{formatDate(booking.date_reservation)}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={`${booking.tickets?.length || 0} tickets`}
                                            color="primary"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {calculateTotalPrice(booking).toFixed(2)} €
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => onEdit(booking)}
                                                sx={{ borderRadius: '8px' }}
                                            >
                                                Edit
                                            </Button>
                                            <DeleteButton onDelete={() => onDelete(booking.id)} />
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={bookings.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

export default BookingList;