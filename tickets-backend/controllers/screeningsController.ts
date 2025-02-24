import { Request, Response } from 'express';
const pool = require('../db');

export const getScreenings = async (req: Request, res: Response): Promise<any> => {
  try {
    const { data, error } = await pool
      .from('seances')
      .select('*');  // possibly join with 'films' or 'salles' if needed

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Server error fetching seances' });
  }
};

export const getScreeningById = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  try {
    const { data, error } = await pool
      .from('seances')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: error.message });
    }
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Server error fetching seance' });
  }
};

export const createScreening= async (req: Request, res: Response): Promise<any> => {
  try {
    const { film_id, salle_id, heure, prix_base } = req.body;
    const { data, error } = await pool
      .from('seances')
      .insert([{ film_id, salle_id, heure, prix_base }])
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(201).json(data);
  } catch (err) {
    return res.status(400).json({ error: 'Failed to create screening' });
  }
};

export const updateScreening = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  try {
    const { film_id, salle_id, heure, prix_base } = req.body;
    const { data, error } = await pool
      .from('seances')
      .update({ film_id, salle_id, heure, prix_base })
      .eq('id', id)
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.json(data);
  } catch (err) {
    return res.status(400).json({ error: 'Failed to update screening' });
  }
};

export const deleteScreening = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  try {
    const { error } = await pool
      .from('seances')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.json({ message: `Seance ${id} deleted.` });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete screening' });
  }
};
