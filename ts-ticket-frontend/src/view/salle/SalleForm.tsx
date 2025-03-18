// src/components/SalleForm.tsx
import React, { useState, useEffect } from 'react';
import { TextField, Button, Checkbox, FormControlLabel } from '@mui/material';
import { Salle} from "../../CRUD/Types.ts";
import { createSalle, updateSalle} from "../../CRUD/SalleController.ts";

interface Props {
    existingSalle?: Salle;
    onSave: () => void;
}

const SalleForm: React.FC<Props> = ({ existingSalle, onSave }) => {
    const [salle, setSalle] = useState<Omit<Salle, 'id'>>({
        nom: '',
        dispo: false,
        capacity: 0,
    });

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (existingSalle) {
            await updateSalle({ ...salle, id: existingSalle.id });
        } else {
            await createSalle(salle);
        }
        onSave();
    };

    return (
        <form onSubmit={handleSubmit}>
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
        </form>
    );
};

export default SalleForm;
