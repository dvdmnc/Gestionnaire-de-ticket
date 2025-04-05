import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Paper,
    Box,
    Typography,
    IconButton,
} from '@mui/material';
import { Film } from '../../CRUD/Types';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
    existingFilm?: Film;
    onSave: (film: Film) => void;
    onClose?: () => void;
}

const FilmForm: React.FC<Props> = ({ existingFilm, onSave, onClose }) => {
    const [film, setFilm] = useState<Film>({
        nom: '',
        poster: '',
        annee: new Date().getFullYear(),
        description: '',
        duree: 0,
        realisateur: '',
        genre: '',
    } as Film);

    useEffect(() => {
        if (existingFilm) {
            setFilm(existingFilm);
        }
    }, [existingFilm]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(film);
    };

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <Typography variant="h6" gutterBottom>
                        {existingFilm ? 'Edit Film' : 'Create New Film'}
                </Typography>
                {onClose && (
                        <IconButton
                        onClick={onClose}
                        >
                            <CloseIcon />
                        </IconButton>
                    )}
            </Box>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <TextField label="Title" name="nom" value={film.nom} onChange={handleChange} required />
                <TextField label="Poster URL" name="poster" value={film.poster} onChange={handleChange} required />
                <TextField label="Year" name="annee" type="number" value={film.annee} onChange={handleChange} required />
                <TextField label="Description" name="description" multiline rows={3} value={film.description} onChange={handleChange} />
                <TextField label="Duration (minutes)" name="duree" type="number" value={film.duree} onChange={handleChange} required />
                <TextField label="Director" name="realisateur" value={film.realisateur} onChange={handleChange} required />
                <TextField label="Genre" name="genre" value={film.genre} onChange={handleChange} required />

                <Button type="submit" variant="contained" color="primary">
                    Save
                </Button>
            </Box>
        </Paper>
    );
};

export default FilmForm;
