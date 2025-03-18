// src/components/SalleList.tsx
import { Salle} from "../../CRUD/Types.ts";
import { Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';

interface Props {
    onEdit: (salle: Salle) => void;
    salles: Salle[];
}

const SalleList: React.FC<Props> = ({ onEdit,salles }) => {
    //const [salles, setSalles] = useState<Salle[]>([]);



    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Available</TableCell>
                    <TableCell>Capacity</TableCell>
                    <TableCell>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {salles.map((salle) => (
                    <TableRow key={salle.id}>
                        <TableCell>{salle.nom}</TableCell>
                        <TableCell>{salle.dispo ? 'Yes' : 'No'}</TableCell>
                        <TableCell>{salle.capacity}</TableCell>
                        <TableCell>
                            <Button variant="contained" onClick={() => onEdit(salle)}>Edit</Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default SalleList;
