import { Request, Response } from 'express';
const pool = require('../db'); 

// GET all users
export const getUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const { data, error } = await pool
      .from('users')
      .select('*');
      
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Server error fetching users' });
  }
};

// GET user by ID
export const getUserById = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  try {
    const { data, error } = await pool
      .from('users')
      .select('*')
      .eq('id', id)
      .single(); // single() to fetch exactly one row

    if (error) {
      return res.status(404).json({ error: error.message });
    }
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Server error fetching user' });
  }
};

// POST create user
export const createUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { nom, email, password } = req.body;
    // Insert user into DB
    const { data, error } = await pool
      .from('users')
      .insert([{ nom, email, password }])
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(201).json(data);
  } catch (err) {
    return res.status(400).json({ error: 'Failed to create user' });
  }
};

// PUT update user
export const updateUser = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const { nom, email, password } = req.body;
  try {
    const { data, error } = await pool
      .from('users')
      .update({ nom, email, password })
      .eq('id', id)
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.json(data);
  } catch (err) {
    return res.status(400).json({ error: 'Failed to update user' });
  }
};

// DELETE user
export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  try {
    const { error } = await pool
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.json({ message: `User ${id} deleted.` });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete user' });
  }
};