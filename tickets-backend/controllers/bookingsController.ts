import { Request, Response } from 'express';
const pool = require('../db');

export const getBookings = async (req: Request, res: Response): Promise<any> => {
  try {
    const { data, error } = await pool
      .from('reservations')
      .select('*'); // possibly join with 'users' or 'seances'

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Error fetching bookings' });
  }
};

export const getBookingById = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  try {
    const { data, error } = await pool
      .from('reservations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: error.message });
    }
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Error fetching booking' });
  }
};

export const createBooking = async (req: Request, res: Response): Promise<any> => {
  try {
    const { user_id, seance_id, date_reservation } = req.body;
    const { data, error } = await pool
      .from('reservations')
      .insert([{ user_id, seance_id, date_reservation }])
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(201).json(data);
  } catch (err) {
    return res.status(400).json({ error: 'Failed to create booking' });
  }
};

export const updateBooking = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const { user_id, seance_id, date_reservation } = req.body;
  try {
    const { data, error } = await pool
      .from('reservations')
      .update({ user_id, seance_id, date_reservation })
      .eq('id', id)
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.json(data);
  } catch (err) {
    return res.status(400).json({ error: 'Failed to update booking' });
  }
};

export const deleteBooking = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  try {
    const { error } = await pool
      .from('reservations')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.json({ message: `Booking ${id} deleted.` });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete booking' });
  }
};
