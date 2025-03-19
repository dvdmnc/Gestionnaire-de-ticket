import React, { useState } from 'react';
import { TextField, Button, Paper, Box, Typography } from '@mui/material';
import { loginUser } from '../../CRUD/AuthController';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await loginUser(email, password);
            navigate('/admin/films'); // Redirect after successful login
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 400, margin: 'auto' }}>
            <Typography variant="h5" gutterBottom>
                Login
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <Button type="submit" variant="contained" color="primary">
                    Login
                </Button>
            </Box>
        </Paper>
    );
};

export default Login;
