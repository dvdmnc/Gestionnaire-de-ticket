import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Paper,
    Box,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Divider,
    Avatar,
    FormHelperText
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
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

    // Function to get initials from name
    const getInitials = (name: string) => {
        if (!name) return "U";
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: '12px',
                border: '1px solid #e0e0e0',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)',
                overflow: 'hidden'
            }}
        >
            <Box sx={{
                p: 2,
                backgroundColor: '#f5f7ff',
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center'
            }}>
                <Avatar
                    sx={{
                        bgcolor: '#3f51b5',
                        width: 40,
                        height: 40,
                        mr: 2,
                        fontSize: '1rem'
                    }}
                >
                    {existingUser ? getInitials(existingUser.nom) : "N"}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#232323' }}>
                    {existingUser ? 'Edit User' : 'Create New User'}
                </Typography>
            </Box>

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    p: 3
                }}
            >
                <TextField
                    label="Name"
                    name="nom"
                    value={user.nom}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    InputProps={{
                        sx: { borderRadius: '8px' }
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                                borderColor: '#3f51b5',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#3f51b5',
                            },
                        },
                        '& .MuiFormLabel-root.Mui-focused': {
                            color: '#3f51b5',
                        },
                    }}
                />

                <TextField
                    label="Email"
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    InputProps={{
                        sx: { borderRadius: '8px' }
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                                borderColor: '#3f51b5',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#3f51b5',
                            },
                        },
                        '& .MuiFormLabel-root.Mui-focused': {
                            color: '#3f51b5',
                        },
                    }}
                />

                <TextField
                    label="Password"
                    type="password"
                    name="password"
                    value={user.password || ''}
                    onChange={handleChange}
                    variant="outlined"
                    InputProps={{
                        sx: { borderRadius: '8px' }
                    }}
                    helperText={existingUser ? "Leave empty to keep current password" : ""}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                                borderColor: '#3f51b5',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#3f51b5',
                            },
                        },
                        '& .MuiFormLabel-root.Mui-focused': {
                            color: '#3f51b5',
                        },
                    }}
                />

                <FormControl
                    fullWidth
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            '&:hover fieldset': {
                                borderColor: '#3f51b5',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#3f51b5',
                            },
                        },
                        '& .MuiFormLabel-root.Mui-focused': {
                            color: '#3f51b5',
                        },
                    }}
                >
                    <InputLabel>Role</InputLabel>
                    <Select
                        name="isAdmin"
                        value={user.isAdmin ? 1 : 0}
                        onChange={handleChange}
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    borderRadius: '8px',
                                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
                                }
                            }
                        }}
                    >
                        <MenuItem value={0}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <PersonIcon sx={{ mr: 1, color: '#555555' }} />
                                User
                            </Box>
                        </MenuItem>
                        <MenuItem value={1}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AdminPanelSettingsIcon sx={{ mr: 1, color: '#3f51b5' }} />
                                Admin
                            </Box>
                        </MenuItem>
                    </Select>
                    <FormHelperText>Select user access level</FormHelperText>
                </FormControl>

                <Divider sx={{ my: 1 }} />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={<SaveIcon />}
                        sx={{
                            backgroundColor: '#3f51b5',
                            color: 'white',
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 500,
                            px: 3,
                            py: 1,
                            '&:hover': {
                                backgroundColor: '#303f9f'
                            }
                        }}
                    >
                        {existingUser ? 'Update User' : 'Create User'}
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default UserForm;