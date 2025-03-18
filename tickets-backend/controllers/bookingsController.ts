import { Request, Response } from 'express';
import supabase from '../db';

import { Booking } from './types'; 


export const getBookings = async (
  req: Request,
  res: Response<Booking[] | { error: string }>
): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*'); 

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    
    res.json((data as Booking[]) || []);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching bookings' });
  }
};


export const getBookingById = async (
  req: Request,
  res: Response<Booking | { error: string }>
): Promise<void> => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      res.status(404).json({ error: error.message });
      return;
    }
    if (!data) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }
    res.json(data as Booking);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching booking' });
  }
};


export const createBooking = async (
  req: Request,
  res: Response<Booking | { error: string }>
): Promise<void> => {
  try {
    const { user_id, seance_id, date_reservation } = req.body;

    if (!user_id || !seance_id || !date_reservation) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const { data, error } = await supabase
      .from('reservations')
      .insert([{ user_id, seance_id, date_reservation }])
      .select()
      .single(); 

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(201).json(data as Booking);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create booking' });
  }
};


export const updateBooking = async (
  req: Request,
  res: Response<Booking | { error: string }>
): Promise<void> => {
  const { id } = req.params;
  const { user_id, seance_id, date_reservation } = req.body;
  try {
    if (!user_id && !seance_id && !date_reservation) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    const { data, error } = await supabase
      .from('reservations')
      .update({ user_id, seance_id, date_reservation })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    if (!data) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }
    res.json(data as Booking);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update booking' });
  }
};


export const deleteBooking = async (
  req: Request,
  res: Response<{ message: string } | { error: string }>
): Promise<void> => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', id)
      .select()
      .single(); 

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    if (!data) {
      res.status(404).json({ error: 'Booking not found or already deleted' });
      return;
    }
    res.json({ message: `Booking ${id} deleted.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete booking' });
  }
};
