import { Request, Response } from 'express';
import {supabase} from '../db'; // your Supabase client
import { Room } from '../types/types'; // or define Room here if you prefer

// GET /rooms
export const getRooms = async (
  req: Request,
  res: Response<Room[] | { error: string }>
): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('salles')
      .select('*'); // or select only relevant columns

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json((data as Room[]) || []);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching rooms' });
  }
};

// GET /rooms/:id
export const getRoomById = async (
  req: Request,
  res: Response<Room | { error: string }>
): Promise<void> => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('salles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      res.status(404).json({ error: error.message });
      return;
    }
    if (!data) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }
    res.json(data as Room);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching room' });
  }
};

// POST /rooms
export const createRoom = async (
  req: Request,
  res: Response<Room | { error: string }>
): Promise<void> => {
  try {
    const { nom, dispo, capacity } = req.body;

    // Optional basic validation
    if (nom == null || dispo == null || capacity == null) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const { data, error } = await supabase
      .from('salles')
      .insert([{ nom, dispo, capacity }])
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(201).json(data as Room);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create room' });
  }
};

// PUT /rooms/:id
export const updateRoom = async (
  req: Request,
  res: Response<Room | { error: string }>
): Promise<void> => {
  const { id } = req.params;
  try {
    const { nom, dispo, capacity } = req.body;

    const { data, error } = await supabase
      .from('salles')
      .update({ nom, dispo, capacity })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    if (!data) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }
    res.json(data as Room);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update room' });
  }
};

// DELETE /rooms/:id
export const deleteRoom = async (
  req: Request,
  res: Response<{ message: string } | { error: string }>
): Promise<void> => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('salles')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    if (!data) {
      res.status(404).json({ error: 'Room not found or already deleted' });
      return;
    }
    res.json({ message: `Salle ${id} deleted.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete room' });
  }
};
