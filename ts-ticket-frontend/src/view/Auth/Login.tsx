import React, { useState } from 'react';
import { TextField, Button  , Box, Typography, Alert, Snackbar } from '@mui/material';
import { loginUser } from '../../CRUD/AuthController';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    
   
    const [error, setError] = useState<string | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data =  await loginUser(email, password);
            data.isAdmin ? navigate('/admin/films') : navigate('/client/home')
             // Redirection après connexion réussie vers panneau d'Administration ou côté client
        } catch (error) {
            console.error('Login failed', error);
            
            
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    setError('Email ou mot de passe incorrect');
                } else if (error.response?.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
                    setError(error.response.data.message as string);
                } else {
                    setError('Erreur lors de la connexion');
                }
            } else if (error instanceof Error) {
                setError(error.message || 'Une erreur est survenue lors de la connexion');
            } else {
                setError('Une erreur inattendue est survenue');
            }
            
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Box sx={{ 
            display: 'flex', 
            minHeight: '90vh',
            flexDirection: { xs: 'column', md: 'row' },
            backgroundColor: '#ffffff'
        }}>
            
            <Box sx={{
                flexBasis: { md: '55%' },
                display: { xs: 'none', md: 'flex' }, 
                position: 'relative',
                overflow: 'hidden',
                padding: '20px 20px 20px 20px',
            }}>
                <img
                    src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Cinema theater"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '10px',
                        objectPosition: 'center'
                    }}
                />
                <Box sx={{
                    position: 'absolute',
                    bottom: 40,
                    left: 40,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    padding: '16px 24px',
                    borderRadius: '8px',
                    maxWidth: '70%'
                }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#232323' }}>
                        CineGold Admin Portal
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#555555', mt: 1 }}>
                        Manage your theater experience in one place
                    </Typography>
                </Box>
            </Box>

            
            <Box sx={{
                flexBasis: { md: '45%' },
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: { xs: 3, sm: 6 },
                backgroundColor: '#ffffff'
            }}>
                <Box sx={{
                    width: '100%',
                    maxWidth: 450
                }}>
                    <Box sx={{ mb: 6, textAlign: 'center' }}>
                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{
                                fontWeight: 700,
                                color: '#232323',
                                mb: 1
                            }}
                        >
                            Welcome Back
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: '#666666'
                            }}
                        >
                            Sign in to access your admin dashboard
                        </Typography>
                    </Box>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3
                        }}
                    >
                        <TextField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            variant="outlined"
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                    '& fieldset': {
                                        borderColor: '#e0e0e0',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#bbbbbb',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#3f51b5',
                                    }
                                }
                            }}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            variant="outlined"
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                    '& fieldset': {
                                        borderColor: '#e0e0e0',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#bbbbbb',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#3f51b5',
                                    }
                                }
                            }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                py: 1.5,
                                borderRadius: '8px',
                                fontWeight: 600,
                                backgroundColor: '#3f51b5',
                                textTransform: 'none',
                                fontSize: '1rem',
                                boxShadow: '0 3px 5px rgba(0, 0, 0, 0.1)',
                                '&:hover': {
                                    backgroundColor: '#303f9f',
                                    boxShadow: '0 5px 8px rgba(0, 0, 0, 0.2)'
                                }
                            }}
                        >
                            Sign In
                        </Button>
                        <Typography
                            variant="body2"
                            align="center"
                            sx={{
                                color: '#666666',
                                mt: 2
                            }}
                        >
                            Having trouble signing in? 
                            <span
                            style={{ color: '#3f51b5', cursor: 'pointer', marginLeft:2 }}
                            onClick={() => navigate('/reset-password')}
                            >
                            Reset your password
                        </span>
                        </Typography>
                    </Box>

                    
                    <Box
                        sx={{
                            display: { xs: 'block', md: 'none' },
                            mt: 6,
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Cinema theater"
                            style={{
                                width: '100%',
                                height: 'auto',
                                display: 'block'
                            }}
                        />
                    </Box>
                </Box>
            </Box>

            
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity="error"
                    sx={{
                        width: '100%'
                    }}
                >
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Login;
