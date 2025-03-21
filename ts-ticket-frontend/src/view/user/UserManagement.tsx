import React, { useState, useEffect } from 'react';
import UserList from './UserList';
import UserForm from './UserForm';
import { User } from '../../CRUD/Types';
import {
    Container,
    Button,
    Modal,
    Box,
    Typography,
    Paper,
    Backdrop,
    Fade,
    IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { getUsers, createUser, updateUser, deleteUser } from '../../CRUD/UserController';
import { useNotifications } from '@toolpad/core';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const notifications = useNotifications();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const fetchedUsers = await getUsers();
            setUsers(fetchedUsers);
        } catch (error) {
            notifications.show('Failed to fetch users', { severity: 'error', autoHideDuration: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setOpen(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteUser(id);
            notifications.show('User deleted successfully', { severity: 'success', autoHideDuration: 2000 });
            fetchUsers();
        } catch (error) {
            notifications.show('Failed to delete user', { severity: 'error', autoHideDuration: 3000 });
        }
    };

    const handleClose = () => {
        setSelectedUser(null);
        setOpen(false);
    };

    const handleSave = async (user: User) => {
        try {
            if ('id' in user) {
                await updateUser(user);
                notifications.show('User updated successfully', { severity: 'success', autoHideDuration: 2000 });
            } else {
                await createUser(user);
                notifications.show('User created successfully', { severity: 'success', autoHideDuration: 2000 });
            }
            fetchUsers();
            handleClose();
        } catch (error) {
            notifications.show('Failed to save user', { severity: 'error', autoHideDuration: 3000 });
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: '12px',
                    border: '1px solid #e0e0e0',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PeopleAltIcon sx={{ color: '#3f51b5', mr: 2, fontSize: 28 }} />
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#232323' }}>
                        User Management
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                    sx={{
                        backgroundColor: '#3f51b5',
                        color: 'white',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 500,
                        px: 3,
                        '&:hover': {
                            backgroundColor: '#303f9f'
                        }
                    }}
                >
                    Create New User
                </Button>
            </Paper>

            <Box sx={{ mb: 4 }}>
                <UserList
                    users={users}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </Box>

            <Modal
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 500,
                        maxWidth: '90%',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        borderRadius: '12px',
                        p: 0,
                        outline: 'none',
                    }}>
                        <IconButton
                            aria-label="close"
                            onClick={handleClose}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: 'grey.500',
                                zIndex: 1
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <UserForm existingUser={selectedUser || undefined} onSave={handleSave} />
                    </Box>
                </Fade>
            </Modal>
        </Container>
    );
};

export default UserManagement;