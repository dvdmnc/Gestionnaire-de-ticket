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
import { Seance } from '../../CRUD/Types';
import DeleteButton from "../DeleteButton.tsx";

interface Props {
    seances: Seance[];
    onEdit: (seance: Seance) => void;
    onDelete: (id: number) => void;
}

const SeanceList: React.FC<Props> = ({ seances, onEdit, onDelete }) => {
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
                            <TableCell>Time</TableCell>
                            <TableCell>Film</TableCell>
                            <TableCell>Salle</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {seances
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((seance, index) => (
                                <TableRow
                                    key={seance.id}
                                    hover
                                    style={{
                                        cursor: 'pointer',
                                        backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white',
                                    }}
                                >
                                    <TableCell>{seance.heure}</TableCell>
                                    <TableCell>{seance.film_id}</TableCell>
                                    <TableCell>{seance.salle_id}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" onClick={() => onEdit(seance)} sx={{ mr: 1 }}>
                                            Edit
                                        </Button>
                                        <DeleteButton onDelete={() => onDelete(seance.id!)} />
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={seances.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

export default SeanceList;
