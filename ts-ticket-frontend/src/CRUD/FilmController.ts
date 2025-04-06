import axios from 'axios';
import { Film } from './Types.ts';

const API_URL = 'http://localhost:5000/films';

// Helper function to get the token
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) return {};  // Return empty headers if no token
    return { Authorization: `Bearer ${token}` };
};

// Fetch all films - public access, doesn't require authentication
export const getFilms = async () => {
    const response = await axios.get(API_URL);
    console.log("RAW response from backend:", response.data);
    return response.data;
};

export const getFilmById = async (id: number) => {
    const response = await axios.get<{ film: Film }>(`${API_URL}/${id}`);
    return response.data.film;
  };
// Create a new film - requires authentication
export const createFilm = async (film: Omit<Film, 'id'>) => {
    const headers = getAuthHeaders();
    if (!headers.Authorization) throw new Error('Authentication required to create films');
    
    const response = await axios.post<Film>(API_URL, film, { headers });
    return response.data;
};

// Update an existing film - requires authentication
export const updateFilm = async (film: Film) => {
    const headers = getAuthHeaders();
    if (!headers.Authorization) throw new Error('Authentication required to update films');
    
    const response = await axios.put<Film>(`${API_URL}/${film.id}`, film, { headers });
    return response.data;
};

// Delete a film - requires authentication
export const deleteFilm = async (id: number) => {
    const headers = getAuthHeaders();
    if (!headers.Authorization) throw new Error('Authentication required to delete films');
    
    await axios.delete(`${API_URL}/${id}`, { headers });
};