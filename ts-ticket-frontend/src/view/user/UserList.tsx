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
import { User } from '../../CRUD/Types';
import DeleteButton from "../DeleteButton.tsx";

interface Props {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (id: number) => void;
}

const UserList: React.FC<Props> = ({ users, onEdit, onDelete }) => {
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
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((user, index) => (
                                <TableRow
                                    key={user.id}
                                    hover
                                    style={{
                                        cursor: 'pointer',
                                        backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white',
                                    }}
                                >
                                    <TableCell>{user.nom}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.isAdmin ? "Admin" : "User"}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" onClick={() => onEdit(user)} sx={{ mr: 1 }}>
                                            Edit
                                        </Button>
                                        <DeleteButton onDelete={() => onDelete(user.id!)} />
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={users.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

export default UserList;
