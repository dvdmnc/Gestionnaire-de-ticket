import axios from 'axios';
import { Salle } from './Types.ts';

const API_URL = 'http://localhost:5000/salles';

export const getSalles = async () => {
    const response = await axios.get<Salle[]>(API_URL);
    return response.data;
};

export const createSalle = async (salle:Salle) => {
    const response = await axios.post<Salle>(API_URL, salle);
    return response.data;
};

export const updateSalle = async (salle: Salle) => {
    const response = await axios.put<Salle>(`${API_URL}/${salle.id}`, salle);
    return response.data;
};

export const deleteSalle = async (id: number) => {
    await axios.delete(`${API_URL}/${id}`);
};
