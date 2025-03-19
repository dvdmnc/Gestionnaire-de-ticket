import React, { useState, useEffect } from 'react';
import { TextField, Button, Paper, Box, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { User } from '../../CRUD/Types';

interface Props {
    existingUser?: User;
    onSave: (user: User) => void;
}

const UserForm: React.FC<Props> = ({ existingUser, onSave }) => {
    const [user, setUser] = useState<User>({
        nom: '',
        email: '',
        password: '',
        isAdmin: false,
    } as User);

    useEffect(() => {
        if (existingUser) {
            setUser(existingUser);
        }
    }, [existingUser]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        if (name === 'isAdmin') {
            setUser((prev) => ({
                ...prev,
                isAdmin: Number(value) === 1, // Convert value to boolean
            }));
        } else {
            setUser((prev) => ({
                ...prev,
                [name as string]: value,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(user);
    };

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                {existingUser ? 'Edit User' : 'Create New User'}
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="Name" name="nom" value={user.nom} onChange={handleChange} required />
                <TextField label="Email" type="email" name="email" value={user.email} onChange={handleChange} required />
                <TextField label="Password" type="password" name="password" value={user.password || ''} onChange={handleChange} />

                {/* Proper Role Selection */}
                <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select name="isAdmin" value={user.isAdmin ? 1 : 0} onChange={handleChange}>
                        <MenuItem value={0}>User</MenuItem>
                        <MenuItem value={1}>Admin</MenuItem>
                    </Select>
                </FormControl>

                <Button type="submit" variant="contained" color="primary">
                    Save
                </Button>
            </Box>
        </Paper>
    );
};

export default UserForm;
