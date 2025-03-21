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
} from '@mui/material';
import { Booking } from '../../CRUD/Types';
import DeleteButton from "../DeleteButton.tsx";

interface Props {
    bookings: Booking[];
    onEdit: (booking: Booking) => void;
    onDelete: (id: number) => void;
}

const BookingList: React.FC<Props> = ({ bookings, onEdit, onDelete }) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Screening ID</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Tickets</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookings
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((booking, index) => (
                                <TableRow key={booking.id} hover>
                                    <TableCell>{booking.seance_id}</TableCell>
                                    <TableCell>{booking.user_id}</TableCell>
                                    <TableCell>{booking.date_reservation}</TableCell>
                                    <TableCell>{booking.tickets?.length || 0}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" onClick={() => onEdit(booking)}>
                                            Edit
                                        </Button>
                                        <DeleteButton onDelete={() => onDelete(booking.id!)} />
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
