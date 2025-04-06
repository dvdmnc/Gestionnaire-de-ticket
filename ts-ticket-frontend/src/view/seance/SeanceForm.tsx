import React, { useState, useEffect } from 'react';
import {
    Button,
    Paper,
    Box,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel, TextField,
    IconButton
} from '@mui/material';
import { Seance, Film, Salle } from '../../CRUD/Types';
import { getFilms } from '../../CRUD/FilmController';
import { getSalles } from '../../CRUD/SalleController';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFnsV3";
import {Dayjs} from "dayjs";
import dayjs from "dayjs";
import CloseIcon from '@mui/icons-material/Close';

interface Props {
    existingSeance?: Seance;
    onSave: (seance: Seance) => void;
    onClose?: () => void;
}

const SeanceForm: React.FC<Props> = ({ existingSeance, onSave, onClose }) => {
    const [seance, setSeance] = useState<Seance>({
        film_id: 0,
        salle_id: 0,
        heure: '',
    } as Seance);

    const [films, setFilms] = useState<Film[]>([]);
    const [salles, setSalles] = useState<Salle[]>([]);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

    useEffect(() => {
        getFilms().then(setFilms);
        getSalles().then(setSalles);

        if (existingSeance) {
            setSeance(existingSeance);
            // Convert string date to Dayjs format
            setSelectedDate(existingSeance.heure ? dayjs(existingSeance.heure) : null);
        }
    }, [existingSeance]);

    const handleChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setSeance((prev) => ({
            ...prev,
            [name as string]: value,
        }));
    };

    const handleDateChange = (newValue: Dayjs | null) => {
        setSelectedDate(newValue);
        if(!newValue.isValid()) return
        setSeance((prev) => ({
            ...prev,
            heure: newValue ? newValue.toISOString() : '', // Convert to ISO string format
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(seance);
    };

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
             <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <Typography variant="h6" gutterBottom>
                    {existingSeance ? 'Edit Seance' : 'Create New Seance'}
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
                {/* Date-Time Picker */}
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                        label="Time (Date & Time)"
                        onChange={(e:Date | null)=>{
                            const date = e ? dayjs(e) : null; // Ensure dayjs is properly used
                            handleDateChange(date);
                        }

                    }
                        renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                </LocalizationProvider>
                {/* Film Selection */}
                <FormControl fullWidth>
                    <InputLabel>Film</InputLabel>
                    <Select name="film_id" value={seance.film_id || 0} onChange={handleChange} required>
                        {films.map((film) => (
                            <MenuItem key={film.id} value={film.id}>
                                {film.nom} ({film.annee})
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Salle Selection */}
                <FormControl fullWidth>
                    <InputLabel>Salle</InputLabel>
                    <Select name="salle_id" value={seance.salle_id || 0} onChange={handleChange} required>
                        {salles.map((salle) => (
                            <MenuItem key={salle.id} value={salle.id}>
                                {salle.nom} - Capacity: {salle.capacity}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button type="submit" variant="contained" color="primary">
                    Save
                </Button>
            </Box>
        </Paper>
    );
};

export default SeanceForm;
