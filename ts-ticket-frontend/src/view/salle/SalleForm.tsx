import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Paper,
    Box,
    Typography,
} from '@mui/material';
import { Salle } from '../../CRUD/Types';

interface Props {
    existingSalle?: Salle;
    onSave: (salle: Salle) => void;
}

const SalleForm: React.FC<Props> = ({ existingSalle, onSave }) => {
    const [salle, setSalle] = useState<Salle>({
        nom: '',
        dispo: false,
        capacity: 0,
    } as Salle);

    useEffect(() => {
        if (existingSalle) {
            setSalle(existingSalle);
        }
    }, [existingSalle]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setSalle((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(salle);
    };

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                {existingSalle ? 'Edit Salle' : 'Create New Salle'}
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    '& .MuiTextField-root': { mb: 2, width: '100%' },
                    '& .MuiFormControlLabel-root': { mb: 2 },
                    '& .MuiButton-root': { mt: 2 },
                }}
            >
                <TextField
                    label="Name"
                    name="nom"
                    value={salle.nom}
                    onChange={handleChange}
                    required
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={salle.dispo}
                            onChange={handleChange}
                            name="dispo"
                        />
                    }
                    label="Available"
                />
                <TextField
                    label="Capacity"
                    name="capacity"
                    type="number"
                    value={salle.capacity}
                    onChange={handleChange}
                    required
                />
                <Button type="submit" variant="contained" color="primary">
                    Save
                </Button>
            </Box>
        </Paper>
    );
};

export default SalleForm;
