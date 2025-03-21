import axios from 'axios';
import { Booking, Ticket } from './Types.ts';

const API_URL = 'http://localhost:5000/bookings';

// Fetch all bookings
export const getBookings = async () => {
    const response = await axios.get<Booking[]>(API_URL);
    return response.data;
};

// Create a new booking with tickets
export const createBooking = async (booking: Omit<Booking, 'id'>, tickets: Omit<Ticket, 'id'>[]) => {
    const response = await axios.post<Booking>(API_URL, { booking, tickets });
    return response.data;
};

// Update an existing booking
export const updateBooking = async (booking: Booking, tickets: Ticket[]) => {
    const response = await axios.put<Booking>(`${API_URL}/${booking.id}`, { booking, tickets });
    return response.data;
};

// Delete a booking
export const deleteBooking = async (id: number) => {
    await axios.delete(`${API_URL}/${id}`);
};
