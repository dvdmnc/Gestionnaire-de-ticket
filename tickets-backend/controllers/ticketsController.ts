import { Request, Response } from 'express';
const pool = require('../db');

export const getTickets = async (req: Request, res: Response): Promise <any> => {
  try {
    const { data, error } = await pool
      .from('tickets')
      .select('*');

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Error fetching tickets' });
  }
};

export const getTicketById = async (req: Request, res: Response): Promise <any> => {
  const { id } = req.params;
  try {
    const { data, error } = await pool
      .from('tickets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: error.message });
    }
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Error fetching ticket' });
  }
};

export const createTicket = async (req: Request, res: Response): Promise <any> => {
  try {
    const { reservation_id, type, num_siege, price } = req.body;
    const { data, error } = await pool
      .from('tickets')
      .insert([{ reservation_id, type, num_siege, price }])
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(201).json(data);
  } catch (err) {
    return res.status(400).json({ error: 'Failed to create ticket' });
  }
};

export const updateTicket = async (req: Request, res: Response): Promise <any> => {
  const { id } = req.params;
  const { reservation_id, type, num_siege, price } = req.body;
  try {
    const { data, error } = await pool
      .from('tickets')
      .update({ reservation_id, type, num_siege, price })
      .eq('id', id)
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.json(data);
  } catch (err) {
    return res.status(400).json({ error: 'Failed to update ticket' });
  }
};

export const deleteTicket = async (req: Request, res: Response): Promise <any> => {
  const { id } = req.params;
  try {
    const { error } = await pool
      .from('tickets')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.json({ message: `Ticket ${id} deleted.` });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete ticket' });
  }
};
