import { Request, Response } from 'express';
import {supabase} from '../db/db';
import { Ticket } from '../types/types';


export const getTickets = async (
  req: Request,
  res: Response<Ticket[] | { error: string }>
): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('*');

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json((data as Ticket[]) || []);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching tickets' });
  }
};


export const getTicketById = async (
  req: Request,
  res: Response<Ticket | { error: string }>
): Promise<void> => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      res.status(404).json({ error: error.message });
      return;
    }
    if (!data) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }
    res.json(data as Ticket);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching ticket' });
  }
};


export const createTicket = async (
  req: Request,
  res: Response<Ticket | { error: string }>
): Promise<void> => {
  try {
    const { reservation_id, type, num_siege, price } = req.body;
    if (!reservation_id || !type || !num_siege || price == null) {
      res.status(400).json({ error: 'Missing fields' });
      return;
    }
    const { data, error } = await supabase
      .from('tickets')
      .insert([{ reservation_id, type, num_siege, price }])
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(201).json(data as Ticket);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create ticket' });
  }
};


export const updateTicket = async (
  req: Request,
  res: Response<Ticket | { error: string }>
): Promise<void> => {
  const { id } = req.params;
  const { reservation_id, type, num_siege, price } = req.body;
  try {
    const { data, error } = await supabase
      .from('tickets')
      .update({ reservation_id, type, num_siege, price })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    if (!data) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }
    res.json(data as Ticket);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update ticket' });
  }
};


export const deleteTicket = async (
  req: Request,
  res: Response<{ message: string } | { error: string }>
): Promise<void> => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('tickets')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    if (!data) {
      res.status(404).json({ error: 'Ticket not found or already deleted' });
      return;
    }
    res.json({ message: `Ticket ${id} deleted.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
};
