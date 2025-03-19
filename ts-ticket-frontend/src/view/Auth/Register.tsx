import React, { useState } from 'react';
import { TextField, Button, Paper, Box, Typography } from '@mui/material';
import { registerUser } from '../../CRUD/AuthController';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await registerUser(nom, email, password);
            navigate('/login');
        } catch (error) {
            console.error('Registration failed', error);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 400, margin: 'auto' }}>
            <Typography variant="h5" gutterBottom>
                Register
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="Name" value={nom} onChange={(e) => setNom(e.target.value)} required />
                <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <Button type="submit" variant="contained" color="primary">
                    Register
                </Button>
            </Box>
        </Paper>
    );
};

export default Register;
