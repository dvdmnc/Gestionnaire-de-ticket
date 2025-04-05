import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Paper,
    Box,
    Typography,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { Film, filmGenre } from '../../CRUD/Types';
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

    // Available film genres from the Types.ts file
    const filmGenres: filmGenre[] = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Documentary', 'Animation'];

    useEffect(() => {
        if (existingFilm) {
            setFilm(existingFilm);
        }
    }, [existingFilm]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setFilm((prev) => ({
            ...prev,
            [name as string]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(film);
    };

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" gutterBottom>
                    {existingFilm ? 'Edit Film' : 'Create New Film'}
                </Typography>
                {onClose && (
                    <IconButton onClick={onClose}>
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
                <TextField
                    label="Title"
                    name="nom"
                    value={film.nom}
                    onChange={handleChange}
                    required
                    fullWidth
                />
                <TextField
                    label="Poster URL"
                    name="poster"
                    value={film.poster}
                    onChange={handleChange}
                    required
                    fullWidth
                />
                <TextField
                    label="Year"
                    name="annee"
                    type="number"
                    value={film.annee}
                    onChange={handleChange}
                    required
                    fullWidth
                />
                <TextField
                    label="Description"
                    name="description"
                    multiline
                    rows={3}
                    value={film.description}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    label="Duration (minutes)"
                    name="duree"
                    type="number"
                    value={film.duree}
                    onChange={handleChange}
                    required
                    fullWidth
                />
                <TextField
                    label="Director"
                    name="realisateur"
                    value={film.realisateur}
                    onChange={handleChange}
                    required
                    fullWidth
                />
                <FormControl fullWidth required>
                    <InputLabel>Genre</InputLabel>
                    <Select
                        name="genre"
                        value={film.genre || ''}
                        onChange={handleChange}
                    >
                        {filmGenres.map((genre) => (
                            <MenuItem key={genre} value={genre}>
                                {genre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                >
                    Save
                </Button>
            </Box>
        </Paper>
    );
};

export default FilmForm;