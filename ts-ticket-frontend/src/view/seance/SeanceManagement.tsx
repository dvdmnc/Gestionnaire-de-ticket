import React, { useState, useEffect } from 'react';
import SeanceList from './SeanceList';
import SeanceForm from './SeanceForm';
import { Seance } from '../../CRUD/Types';
import { Container, Button, Modal, Box, Typography, Paper } from '@mui/material';
import { getSeances, createSeance, updateSeance, deleteSeance } from '../../CRUD/SeanceController';
import { useNotifications } from '@toolpad/core';
import AddIcon from '@mui/icons-material/Add';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

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
                                <AccessTimeIcon sx={{ color: '#3f51b5', mr: 2, fontSize: 28 }} />
                                <Typography variant="h5" sx={{ fontWeight: 600, color: '#232323' }}>
                                Screening Management
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
                               Create New Screening
                            </Button>
                        </Paper>
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
