import axios from 'axios';
import { BookingWithTickets } from './Types.ts';

const API_URL = 'http://localhost:5000/reservations';

// Helper function to get the token
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');
    return { Authorization: `Bearer ${token}` };
    
};

// Fetch all bookings
export const getBookings = async () => {
    const response = await axios.get<BookingWithTickets[]>(API_URL, { headers: getAuthHeaders() });
    return response.data;
};

// Get a specific booking by ID
export const getBookingById = async (id: number) => {
    const response = await axios.get<BookingWithTickets>(`${API_URL}/${id}`, { headers: getAuthHeaders() });
    return response.data;
};

// Create a new booking with tickets
export const createBooking = async (bookingWithTickets: BookingWithTickets) => {
    console.log('Creating booking:', bookingWithTickets);

    const response = await axios.post<BookingWithTickets>(API_URL, bookingWithTickets, { headers: getAuthHeaders() });
    return response.data;
};

// Update an existing booking
export const updateBooking = async (bookingWithTickets: BookingWithTickets) => {
    console.log('Updating booking:', bookingWithTickets);
    const response = await axios.put<BookingWithTickets>(
        `${API_URL}/${bookingWithTickets.id}`,
        bookingWithTickets,
        { headers: getAuthHeaders() }
    );
    return response.data;
};

// Delete a booking
export const deleteBooking = async (id: number) => {
    await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
};

// Get bookings for a specific user
export const getUserBookings = async (userId: string) => {
    const response = await axios.get<BookingWithTickets[]>(`${API_URL}/user/${userId}`, { headers: getAuthHeaders() });
    return response.data;
};

// Get bookings for a specific seance
export const getSeanceBookings = async (seanceId: number) => {
    const response = await axios.get<BookingWithTickets[]>(`${API_URL}/seance/${seanceId}`, { headers: getAuthHeaders() });
    return response.data;
};