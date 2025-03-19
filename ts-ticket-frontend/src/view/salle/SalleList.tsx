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
import { Salle } from '../../CRUD/Types';
import DeleteButton from "../DeleteButton.tsx";

interface Props {
    salles: Salle[];
    onEdit: (salle: Salle) => void;
    onDelete: (id: number) => void;
}

const SalleList: React.FC<Props> = ({ salles, onEdit, onDelete }) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleChangePage = (_event: unknown, newPage: number) => {

        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
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
                            <TableCell>Available</TableCell>
                            <TableCell>Capacity</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {salles
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((salle, index) => (
                                <TableRow
                                    key={salle.id}
                                    hover
                                    style={{
                                        cursor: 'pointer',
                                        backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white',
                                    }}
                                >
                                    <TableCell>{salle.nom}</TableCell>
                                    <TableCell>{salle.dispo ? 'Yes' : 'No'}</TableCell>
                                    <TableCell>{salle.capacity}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => onEdit(salle)}
                                            sx={{ mr: 1 }}
                                        >
                                            Edit
                                        </Button>
                                        <DeleteButton
                                            onDelete={() => onDelete(salle.id)}
                                        />

                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={salles.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

export default SalleList;
