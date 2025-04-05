import React, { useState, useEffect } from 'react';
import FilmList from './FilmList.tsx';
import FilmForm from './FilmForm.tsx';
import { Film } from '../../CRUD/Types.ts';
import { Container, Button, Modal, Box, Typography } from '@mui/material';
import { getFilms, createFilm, updateFilm, deleteFilm} from "../../CRUD/FilmController.ts";
import { useNotifications } from '@toolpad/core';


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
            <Typography variant="h4" gutterBottom>
                Film Management
            </Typography>
            <Button variant="contained" onClick={() => setOpen(true)} sx={{ my: 2 }}>
                Create New Film
            </Button>
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
