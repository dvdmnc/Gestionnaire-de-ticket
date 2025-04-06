import axios from 'axios';
import { Salle } from './Types.ts';

const API_URL = 'http://localhost:5000/salles';
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');
    return { Authorization: `Bearer ${token}` };
};

export const getSalles = async () => {
    const response = await axios.get<Salle[]>(API_URL);
    return response.data;
};

export const createSalle = async (salle:Salle) => {
    const response = await axios.post<Salle>(API_URL, salle, { headers: getAuthHeaders() });
    return response.data;
};

export const updateSalle = async (salle: Salle) => {
    const response = await axios.put<Salle>(`${API_URL}/${salle.id}`, salle, { headers: getAuthHeaders() });
    return response.data;
};

export const deleteSalle = async (id: number) => {
    await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
};
