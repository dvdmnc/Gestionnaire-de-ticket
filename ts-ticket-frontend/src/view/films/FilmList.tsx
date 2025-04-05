import React from 'react';
import { Film } from '../../CRUD/Types.ts';
import DataTable from "../DataTable.tsx";

interface Props {
    films: Film[];
    onEdit: (film: Film) => void;
    onDelete: (id: number) => void;
}

const FilmList: React.FC<Props> = ({ films, onEdit, onDelete }) => {
    // Define columns for the DataTable
    const columns = [
        {
            id: 'nom',
            label: 'Title',
            minWidth: 200,
        },
        {
            id: 'annee',
            label: 'Year',
            minWidth: 100,
            align: 'right'
        },
        {
            id: 'realisateur',
            label: 'Director',
            minWidth: 170,
        },
        {
            id: 'genre',
            label: 'Genre',
            minWidth: 150,
        }
    ];

    // Configure the chip field for genre display
    const chipConfig = {
        getValue: (film: Film) => film.genre,
        getColor: (value: string) => {
            // Map genres to colors (customize based on your preferences)
            const colorMap: Record<string, { bg: string; text: string }> = {
                'Action': { bg: '#f44336', text: 'white' },
                'Comedy': { bg: '#ff9800', text: 'black' },
                'Drama': { bg: '#3f51b5', text: 'white' },
                'Horror': { bg: '#000000', text: 'white' },
                'Sci-Fi': { bg: '#2196f3', text: 'white' },
                'Documentary': { bg: '#4caf50', text: 'white' },
                'Animation': { bg: '#9c27b0', text: 'white' }
                // Add more genres as needed
            };

            return colorMap[value] || { bg: '#e0e0e0', text: '#555555' };
        }
    };

    return (
        <DataTable
            title="Films"
            data={films}
            columns={columns}
            primaryKey="id"
            onEdit={onEdit}
            onDelete={onDelete}
            avatarField="nom"
            chipField="genre"
            chipConfig={chipConfig}
        />
    );
};

export default FilmList;