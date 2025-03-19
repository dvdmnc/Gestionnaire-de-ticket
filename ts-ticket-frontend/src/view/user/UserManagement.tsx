import React, { useState, useEffect } from 'react';
import UserList from './UserList';
import UserForm from './UserForm';
import { User } from '../../CRUD/Types';
import { Container, Button, Modal, Box, Typography } from '@mui/material';
import { getUsers, createUser, updateUser, deleteUser } from '../../CRUD/UserController';
import { useNotifications } from '@toolpad/core';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [open, setOpen] = useState(false);
    const notifications = useNotifications();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setOpen(true);
    };

    const handleDelete = async (id: number) => {
        await deleteUser(id);
        notifications.show('User deleted successfully', { severity: 'success', autoHideDuration: 2000 });
        fetchUsers();
    };

    const handleClose = () => {
        setSelectedUser(null);
        setOpen(false);
    };

    const handleSave = async (user: User) => {
            console.log('id' in user ? 'update' : 'create');
            console.log(user);
        if ('id' in user) {
            await updateUser(user);
            notifications.show('User updated successfully', { severity: 'success', autoHideDuration: 2000 });
        } else {
            await createUser(user);
            notifications.show('User created successfully', { severity: 'success', autoHideDuration: 2000 });
        }
        fetchUsers();
        handleClose();
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>User Management</Typography>
            <Button variant="contained" onClick={() => setOpen(true)} sx={{ my: 2 }}>
                Create New User
            </Button>
            <UserList users={users} onEdit={handleEdit} onDelete={handleDelete} />
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ p: 4 }}>
                    <UserForm existingUser={selectedUser || undefined} onSave={handleSave} />
                </Box>
            </Modal>
        </Container>
    );
};

export default UserManagement;
