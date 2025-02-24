import { Request, Response } from 'express';
const pool = require('../db');

export const getRooms = async (req: Request, res: Response): Promise<any> => {
  try {
    const { data, error } = await pool
      .from('salles')
      .select('*');

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Server error fetching salles' });
  }
};

export const getRoomById = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  try {
    const { data, error } = await pool
      .from('salles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: error.message });
    }
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Server error fetching salle' });
  }
};

export const createRoom = async (req: Request, res: Response): Promise<any> => {
  try {
    const { nom, dispo, capacity } = req.body;
    const { data, error } = await pool
      .from('salles')
      .insert([{ nom, dispo, capacity }])
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(201).json(data);
  } catch (err) {
    return res.status(400).json({ error: 'Failed to create salle' });
  }
};

export const updateRoom = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  try {
    const { nom, dispo, capacity } = req.body;
    const { data, error } = await pool
      .from('salles')
      .update({ nom, dispo, capacity })
      .eq('id', id)
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.json(data);
  } catch (err) {
    return res.status(400).json({ error: 'Failed to update salle' });
  }
};

export const deleteRoom = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  try {
    const { error } = await pool
      .from('salles')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.json({ message: `Salle ${id} deleted.` });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete salle' });
  }
};
