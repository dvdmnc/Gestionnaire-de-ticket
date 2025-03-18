import { Request, Response } from 'express';
import supabase from '../db';
import { Screening } from './types';


export const getScreenings = async (
  req: Request,
  res: Response<Screening[] | { error: string }>
): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('seances')
      .select('*'); 

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json((data as Screening[]) || []);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching seances' });
  }
};


export const getScreeningById = async (
  req: Request,
  res: Response<Screening | { error: string }>
): Promise<void> => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('seances')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      res.status(404).json({ error: error.message });
      return;
    }
    if (!data) {
      res.status(404).json({ error: 'Screening not found' });
      return;
    }
    res.json(data as Screening);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching seance' });
  }
};

export const createScreening = async (
  req: Request,
  res: Response<Screening | { error: string }>
): Promise<void> => {
  try {
    const { film_id, salle_id, heure, prix_base } = req.body;


    if (
      film_id == null ||
      salle_id == null ||
      !heure ||
      prix_base == null
    ) {
      res.status(400).json({ error: 'Missing fields' });
      return;
    }

    const { data, error } = await supabase
      .from('seances')
      .insert([{ film_id, salle_id, heure, prix_base }])
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(201).json(data as Screening);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create screening' });
  }
};


export const updateScreening = async (
  req: Request,
  res: Response<Screening | { error: string }>
): Promise<void> => {
  const { id } = req.params;
  try {
    const { film_id, salle_id, heure, prix_base } = req.body;

    const { data, error } = await supabase
      .from('seances')
      .update({ film_id, salle_id, heure, prix_base })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    if (!data) {
      res.status(404).json({ error: 'Screening not found' });
      return;
    }
    res.json(data as Screening);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update screening' });
  }
};


export const deleteScreening = async (
  req: Request,
  res: Response<{ message: string } | { error: string }>
): Promise<void> => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('seances')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    if (!data) {
      res.status(404).json({ error: 'Screening not found or already deleted' });
      return;
    }
    res.json({ message: `Seance ${id} deleted.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete screening' });
  }
};

