import axios from 'axios';
import { Film } from './Types.ts';

const API_URL = 'http://localhost:5000/films';

// Helper function to get the token
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');
    return { Authorization: `Bearer ${token}` };
};

// Fetch all films
export const getFilms = async () => {
    const response = await axios.get<Film[]>(API_URL, { headers: getAuthHeaders() });
    return response.data;
};

// Create a new film
export const createFilm = async (film: Omit<Film, 'id'>) => {
    const response = await axios.post<Film>(API_URL, film, { headers: getAuthHeaders() });
    return response.data;
};

// Update an existing film
export const updateFilm = async (film: Film) => {
    const response = await axios.put<Film>(`${API_URL}/${film.id}`, film, { headers: getAuthHeaders() });
    return response.data;
};

// Delete a film
export const deleteFilm = async (id: number) => {
    await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
};
