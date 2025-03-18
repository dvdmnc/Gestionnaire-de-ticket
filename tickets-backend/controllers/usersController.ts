import { Request, Response } from 'express';
import supabase from '../db'; // must be a Supabase client
import { User } from '../types/types'; // or define it in this file

// GET all users
export const getUsers = async (
  req: Request,
  res: Response<User[] | { error: string }>
): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    // data might be null => default to []
    res.json((data as User[]) || []);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching users' });
  }
};

// GET user by ID
export const getUserById = async (
  req: Request,
  res: Response<User | { error: string }>
): Promise<void> => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      res.status(404).json({ error: error.message });
      return;
    }
    if (!data) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(data as User);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching user' });
  }
};

// POST create user
export const createUser = async (
  req: Request,
  res: Response<User | { error: string }>
): Promise<void> => {
  try {
    const { nom, email, password } = req.body;
    // Optionally, check for missing fields:
    if (!nom || !email || !password) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const { data, error } = await supabase
      .from('users')
      .insert([{ nom, email, password }])
      .select()  // So we get the inserted rows
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(201).json(data as User);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create user' });
  }
};

// PUT update user
export const updateUser = async (
  req: Request,
  res: Response<User | { error: string }>
): Promise<void> => {
  const { id } = req.params;
  const { nom, email, password } = req.body;
  try {
    // Partial or full update
    const { data, error } = await supabase
      .from('users')
      .update({ nom, email, password })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    if (!data) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(data as User);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update user' });
  }
};

// DELETE user
export const deleteUser = async (
  req: Request,
  res: Response<{ message: string } | { error: string }>
): Promise<void> => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    if (!data) {
      res.status(404).json({ error: 'User not found or already deleted' });
      return;
    }
    res.json({ message: `User ${id} deleted.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
