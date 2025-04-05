import React from 'react';
import { Salle } from '../../CRUD/Types.ts';
import DataTable from "../DataTable.tsx";

interface Props {
    salles: Salle[];
    onEdit: (salle: Salle) => void;
    onDelete: (id: number) => void;
}

const SalleList: React.FC<Props> = ({ salles, onEdit, onDelete }) => {
    // Define columns for the DataTable
    const columns = [
        {
            id: 'nom',
            label: 'Name',
            minWidth: 170,
        },
        {
            id: 'dispo',
            label: 'Available',
            minWidth: 120,
            format: (value: boolean) => value ? 'Yes' : 'No'
        },
        {
            id: 'capacity',
            label: 'Capacity',
            minWidth: 120,
            align: 'right'
        }
    ];

    // Configure the chip field for availability status
    const chipConfig = {
        getValue: (salle: Salle) => salle.dispo ? "Available" : "Unavailable",
        getColor: (value: string) => ({
            bg: value === "Available" ? '#4caf50' : '#f44336',
            text: 'white'
        })
    };

    return (
        <DataTable
            title="Salles"
            data={salles}
            columns={columns}
            primaryKey="id"
            onEdit={onEdit}
            onDelete={onDelete}
            chipField="dispo"
            chipConfig={chipConfig}
        />
    );
};

export default SalleList;