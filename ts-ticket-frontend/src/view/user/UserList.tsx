import React from 'react';
import { User } from '../../CRUD/Types.ts';
import DataTable from "../DataTable.tsx";

interface Props {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (id: number) => void;
}

const UserList: React.FC<Props> = ({ users, onEdit, onDelete }) => {
    // Define columns for the DataTable
    const columns = [
        {
            id: 'nom',
            label: 'User',
            minWidth: 170,
        },
        {
            id: 'email',
            label: 'Email',
            minWidth: 200,
        },
        {
            id: 'isAdmin',
            label: 'Role',
            minWidth: 120,
        }
    ];

    // Configure the chip field for roles
    const chipConfig = {
        getValue: (user: User) => user.isAdmin ? "Admin" : "User",
        getColor: (value: string) => ({
            bg: value === "Admin" ? '#3f51b5' : '#e0e0e0',
            text: value === "Admin" ? 'white' : '#555555'
        })
    };

    return (
        <DataTable
            title="User Management"
            data={users}
            columns={columns}
            primaryKey="id"
            onEdit={onEdit}
            onDelete={onDelete}
            avatarField="nom"
            chipField="isAdmin"
            chipConfig={chipConfig}
        />
    );
};

export default UserList;