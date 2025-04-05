import React, { useState, useEffect } from 'react';
import SeanceList from './SeanceList';
import SeanceForm from './SeanceForm';
import { Seance } from '../../CRUD/Types';
import { Container, Button, Modal, Box, Typography } from '@mui/material';
import { getSeances, createSeance, updateSeance, deleteSeance } from '../../CRUD/SeanceController';
import { useNotifications } from '@toolpad/core';

const SeanceManagement: React.FC = () => {
    const [seances, setSeances] = useState<Seance[]>([]);
    const [selectedSeance, setSelectedSeance] = useState<Seance | null>(null);
    const [open, setOpen] = useState(false);
    const notifications = useNotifications();

    useEffect(() => {
        fetchSeances();
    }, []);

    const fetchSeances = async () => {
        const fetchedSeances = await getSeances();
        setSeances(fetchedSeances);
    };

    const handleEdit = (seance: Seance) => {
        setSelectedSeance(seance);
        setOpen(true);
    };

    const handleDelete = async (id: number) => {
        await deleteSeance(id);
        notifications.show('Seance deleted successfully', { severity: 'success', autoHideDuration: 2000 });
        fetchSeances();
    };

    const handleClose = () => {
        setSelectedSeance(null);
        setOpen(false);
    };

    const handleSave = async (seance: Seance) => {
        console.log(seance);
       // seance.id ? await updateSeance(seance) : await createSeance(seance);

        if('id' in seance){
            await updateSeance(seance);
        }
        else{
            await createSeance(seance);
        }


        fetchSeances();
        handleClose();
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Seance Management</Typography>
            <Button variant="contained" onClick={() => setOpen(true)} sx={{ my: 2 }}>Create New Seance</Button>
            <SeanceList seances={seances} onEdit={handleEdit} onDelete={handleDelete} />
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ p: 4 }}>
                    <SeanceForm existingSeance={selectedSeance || undefined} onSave={handleSave} onClose={handleClose}/>
                </Box>
            </Modal>
        </Container>
    );
};

export default SeanceManagement;
