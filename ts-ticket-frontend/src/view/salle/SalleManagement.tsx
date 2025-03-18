// src/pages/SalleManagement.tsx
import React, { useState, useEffect } from 'react';
import SalleList from "./SalleList.tsx";
import SalleForm  from "./SalleForm.tsx";
import { Salle } from "../../CRUD/Types.ts";
import { Container, Button, Modal, Box } from '@mui/material';
import { getSalles, createSalle, updateSalle} from "../../CRUD/SalleController.ts";

const SalleManagement: React.FC = () => {
    const [salles, setSalles] = useState<Salle[]>([]);
    const [selectedSalle, setSelectedSalle] = useState<Salle | null>(null);
    const [open, setOpen] = useState(false);

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

    const handleClose = () => {
        setSelectedSalle(null);
        setOpen(false);
    };

    const handleSave = async (salle: Omit<Salle, 'id'> | Salle) => {
        if ('id' in salle) {
            await updateSalle(salle);
        } else {
            await createSalle(salle);
        }
        fetchSalles();
        handleClose();
    };

    return (
        <Container>
            <Button variant="contained" onClick={() => setOpen(true)} sx={{ my: 2 }}>
                Create New Salle
            </Button>
            <SalleList salles={salles} onEdit={handleEdit} />
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
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default SalleManagement;
