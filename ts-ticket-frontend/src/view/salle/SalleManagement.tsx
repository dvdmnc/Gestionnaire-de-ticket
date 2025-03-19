import React, { useState, useEffect } from 'react';
import SalleList from './SalleList';
import SalleForm from './SalleForm';
import { Salle } from '../../CRUD/Types';
import { Container, Button, Modal, Box, Typography } from '@mui/material';
import { getSalles, createSalle, updateSalle, deleteSalle } from '../../CRUD/SalleController';
import { useNotifications } from '@toolpad/core';

const SalleManagement: React.FC = () => {
    const [salles, setSalles] = useState<Salle[]>([]);
    const [selectedSalle, setSelectedSalle] = useState<Salle | null>(null);
    const [open, setOpen] = useState(false);
    const notifications = useNotifications();

    useEffect(() => {
        fetchSalles();
    }, []);

    const fetchSalles = async () => {
        const fetchedSalles = await getSalles();
        setSalles(fetchedSalles);
    };

    const handleEdit = (salle: Salle) => {
        setSelectedSalle(salle);
        setOpen(true);
    };

    const handleDelete = async (id: number) => {
        await deleteSalle(id);
        notifications.show('Salle deleted successfully', { severity: 'success', autoHideDuration: 2000 });
        fetchSalles();
    };

    const handleClose = () => {
        setSelectedSalle(null);
        setOpen(false);
    };

    const handleSave = async (salle: Salle) => {
        if (salle.id) {
            await updateSalle(salle);
            notifications.show('Salle updated successfully', { severity: 'success', autoHideDuration: 2000 });
        } else {
            await createSalle(salle);
            notifications.show('Salle created successfully', { severity: 'success', autoHideDuration: 2000 });
        }
        fetchSalles();
        handleClose();
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Salle Management
            </Typography>
            <Button variant="contained" onClick={() => setOpen(true)} sx={{ my: 2 }}>
                Create New Salle
            </Button>
            <SalleList salles={salles} onEdit={handleEdit} onDelete={handleDelete} />
            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <SalleForm existingSalle={selectedSalle || undefined} onSave={handleSave} />
                </Box>
            </Modal>
        </Container>
    );
};

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

export default SalleManagement;
