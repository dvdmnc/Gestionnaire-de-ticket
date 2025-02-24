import { Request, Response } from 'express';
const pool = require('../db');

export const getFilms = async (req: Request, res: Response): Promise<any> => {
  try {
    const { data, error } = await pool
      .from('films')
      .select('*');

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Server error fetching films' });
  }
};

export const getFilmById = async (req: Request, res: Response): Promise<any>  => {
  const { id } = req.params;
  try {
    const { data, error } = await pool
      .from('films')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: error.message });
    }
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Server error fetching film' });
  }
};

export const createFilm = async (req: Request, res: Response): Promise<any>  => {
  try {
    const { nom, poster, annee, description } = req.body;
    const { data, error } = await pool
      .from('films')
      .insert([{ nom, poster, annee, description }])
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(201).json(data);
  } catch (err) {
    return res.status(400).json({ error: 'Failed to create film' });
  }
};

export const updateFilm = async (req: Request, res: Response): Promise<any>  => {
  const { id } = req.params;
  try {
    const { nom, poster, annee, description } = req.body;
    const { data, error } = await pool
      .from('films')
      .update({ nom, poster, annee, description })
      .eq('id', id)
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.json(data);
  } catch (err) {
    return res.status(400).json({ error: 'Failed to update film' });
  }
};

export const deleteFilm = async (req: Request, res: Response): Promise<any>  => {
  const { id } = req.params;
  try {
    const { error } = await pool
      .from('films')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.json({ message: `Film ${id} deleted.` });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete film' });
  }
};
