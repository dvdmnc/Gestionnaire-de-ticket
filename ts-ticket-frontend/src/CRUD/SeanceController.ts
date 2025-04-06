import axios from 'axios';
import { Seance } from './Types.ts';

const API_URL = 'http://localhost:5000/seances';
// Helper function to get the token
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');
    return { Authorization: `Bearer ${token}` };
};
// Fetch all seances
export const getSeances = async () => {
    const response = await axios.get<Seance[]>(API_URL);


    return response.data;
};

// Create a new seance
export const createSeance = async (seance: Omit<Seance, 'id'>) => {
    const response = await axios.post<Seance>(API_URL, seance, { headers: getAuthHeaders() });
    return response.data;
};

// Update an existing seance
export const updateSeance = async (seance: Seance) => {
    const response = await axios.put<Seance>(`${API_URL}/${seance.id}`, seance, { headers: getAuthHeaders() });
    return response.data;
};

// Delete a seance
export const deleteSeance = async (id: number) => {
    await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
};
