import React from 'react';
import {Box, Button, Modal} from '@mui/material';

interface Props {
    onDelete: () => void;
}

const DeleteButton: React.FC<Props> = ({  onDelete }) => {
    const handleDelete = async () => {
        //await deleteSalle(itemId);
        onDelete();
        setOpen(false);
        window.location.reload();
    };

    const [open, setOpen] = React.useState(false);

    return (<>
        <Button
            variant="contained"
            color="error"
            onClick={()=>setOpen(true)}>Delete</Button>


        <Modal open={open} onClose={()=>setOpen(false)}>
            <Box
                sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}
            >
                <h2>Are you sure you want to delete this item?</h2>
                <Button onClick={handleDelete}>Yes</Button>
                <Button onClick={()=>setOpen(false)}>No</Button>
            </Box>
        </Modal>

    </>);
};

export default DeleteButton;
