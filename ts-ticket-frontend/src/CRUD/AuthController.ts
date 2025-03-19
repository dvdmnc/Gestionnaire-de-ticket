import axios from 'axios';

const API_URL = 'http://localhost:5000/auth';

// Register a new user
export const registerUser = async (nom: string, email: string, password: string) => {
    const response = await axios.post(`${API_URL}/register`, { nom, email, password });
    return response.data;
};

// Login a user
export const loginUser = async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

// Logout
export const logoutUser = () => {
    localStorage.removeItem('token');
};

// Check if user is authenticated
export const isAuthenticated = () => {
    console.log(localStorage.getItem('token'));
    return !!localStorage.getItem('token');
};
