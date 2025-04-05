import React, { useState, useEffect } from 'react';
import FilmList from './FilmList.tsx';
import FilmForm from './FilmForm.tsx';
import { Film } from '../../CRUD/Types.ts';
import { Container, Button, Modal, Box, Typography, Paper } from '@mui/material';
import { getFilms, createFilm, updateFilm, deleteFilm} from "../../CRUD/FilmController.ts";
import { useNotifications } from '@toolpad/core';
import AddIcon from '@mui/icons-material/Add';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';


const FilmManagement: React.FC = () => {
    const [films, setFilms] = useState<Film[]>([]);
    const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
    const [open, setOpen] = useState(false);
    const notifications = useNotifications();

    useEffect(() => {
        fetchFilms();
    }, []);

    const fetchFilms = async () => {
        const fetchedFilms = await getFilms();
        setFilms(fetchedFilms);
    };

    const handleEdit = (film: Film) => {
        setSelectedFilm(film);
        setOpen(true);
    };

    const handleDelete = async (id: number) => {
        await deleteFilm(id);
        notifications.show('Film deleted successfully', { severity: 'success', autoHideDuration: 2000 });
        fetchFilms();
    };

    const handleClose = () => {
        setSelectedFilm(null);
        setOpen(false);
    };

    const handleSave = async (film: Film) => {
        if (film.id) {
            await updateFilm(film);
            notifications.show('Film updated successfully', { severity: 'success', autoHideDuration: 2000 });
        } else {
            await createFilm(film);
            notifications.show('Film created successfully', { severity: 'success', autoHideDuration: 2000 });
        }
        fetchFilms();
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
                                <LocalMoviesIcon sx={{ color: '#3f51b5', mr: 2, fontSize: 28 }} />
                                <Typography variant="h5" sx={{ fontWeight: 600, color: '#232323' }}>
                                Movie Management
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
                               Create New Movie
                            </Button>
                        </Paper>
            <FilmList films={films} onEdit={handleEdit} onDelete={handleDelete} />
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ p: 4 }}>
                    <FilmForm existingFilm={selectedFilm || undefined} onSave={handleSave} onClose={handleClose}/>
                </Box>
            </Modal>
        </Container>
    );
};

export default FilmManagement;
