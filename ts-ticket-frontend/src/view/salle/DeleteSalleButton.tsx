import React from 'react';
import { deleteSalle} from "../../CRUD/SalleController.ts";
import { Button } from '@mui/material';

interface Props {
    salleId: number;
    onDelete: () => void;
}

const DeleteSalleButton: React.FC<Props> = ({ salleId, onDelete }) => {
    const handleDelete = async () => {
        await deleteSalle(salleId);
        onDelete();
    };

    return <Button onClick={handleDelete}>Delete</Button>;
};

export default DeleteSalleButton;
