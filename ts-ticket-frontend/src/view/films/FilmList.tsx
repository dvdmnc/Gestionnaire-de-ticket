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
import { Film } from '../../CRUD/Types';
import DeleteButton from "../DeleteButton.tsx";

interface Props {
    films: Film[];
    onEdit: (film: Film) => void;
    onDelete: (id: number) => void;
}

const FilmList: React.FC<Props> = ({ films, onEdit, onDelete }) => {
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
                            <TableCell>Title</TableCell>
                            <TableCell>Year</TableCell>
                            <TableCell>Director</TableCell>
                            <TableCell>Genre</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {films
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((film, index) => (
                                <TableRow
                                    key={film.id}
                                    hover
                                    style={{
                                        cursor: 'pointer',
                                        backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white',
                                    }}
                                >
                                    <TableCell>{film.nom}</TableCell>
                                    <TableCell>{film.annee}</TableCell>
                                    <TableCell>{film.realisateur}</TableCell>
                                    <TableCell>{film.genre}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => onEdit(film)}
                                            sx={{ mr: 1 }}
                                        >
                                            Edit
                                        </Button>
                                        <DeleteButton onDelete={() => onDelete(film.id!)} />
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={films.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

export default FilmList;
