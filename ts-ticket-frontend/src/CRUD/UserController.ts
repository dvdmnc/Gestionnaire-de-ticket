import axios from 'axios';
import { User, UserWithBookings } from './Types.ts';

const API_URL = 'http://localhost:5000/users';
// Helper function to get the token
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');
    return { Authorization: `Bearer ${token}` };
};
// Fetch all users
export const getUsers = async () => {
    const response = await axios.get<User[]>(API_URL, { headers: getAuthHeaders() });
    return response.data;
};

//Fetch one user
export const getUserById = async () => {
    const response = await axios.get<UserWithBookings[]>(API_URL, { headers: getAuthHeaders() });
    return response.data;
};

// Create a new user
export const createUser = async (user: User) => {
    const response = await axios.post<User>(API_URL, user, { headers: getAuthHeaders() });
    return response.data;
};

// Update an existing user
export const updateUser = async (user: User) => {
    const response = await axios.put<User>(`${API_URL}/${user.id}`, user, { headers: getAuthHeaders() });
    return response.data;
};

// Delete a user
export const deleteUser = async (id: number) => {
    await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
};
