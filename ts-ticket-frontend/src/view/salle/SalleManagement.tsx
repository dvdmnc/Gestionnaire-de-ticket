import React, { useState, useEffect } from 'react';
import SalleList from './SalleList';
import SalleForm from './SalleForm';
import { Salle } from '../../CRUD/Types';
import { Container, Button, Modal, Box, Typography, Paper } from '@mui/material';
import { getSalles, createSalle, updateSalle, deleteSalle } from '../../CRUD/SalleController';
import { useNotifications } from '@toolpad/core';
import AddIcon from '@mui/icons-material/Add';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';

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
                                <RoomPreferencesIcon sx={{ color: '#3f51b5', mr: 2, fontSize: 28 }} />
                                <Typography variant="h5" sx={{ fontWeight: 600, color: '#232323' }}>
                                Rooms Management
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
                               Create New Room
                            </Button>
                        </Paper>
            <SalleList salles={salles} onEdit={handleEdit} onDelete={handleDelete} />
            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <SalleForm existingSalle={selectedSalle || undefined} onSave={handleSave} onClose={handleClose}/>
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
