import React from 'react';
import { Seance } from '../../CRUD/Types.ts';
import DataTable from "../DataTable.tsx";

interface Props {
    seances: Seance[];
    onEdit: (seance: Seance) => void;
    onDelete: (id: number) => void;
}

const SeanceList: React.FC<Props> = ({ seances, onEdit, onDelete }) => {
    // Define columns for the DataTable
    const columns = [
        {
            id: 'heure',
            label: 'Time',
            minWidth: 120,
        },
        {
            id: 'film_id',
            label: 'Movie',
            minWidth: 170,
        },
        {
            id: 'salle_id',
            label: 'Room Number',
            minWidth: 120,
        }
    ];

    return (
        <DataTable
            title="Séances"
            data={seances}
            columns={columns}
            primaryKey="id"
            onEdit={onEdit}
            onDelete={onDelete}
        />
    );
};

export default SeanceList;