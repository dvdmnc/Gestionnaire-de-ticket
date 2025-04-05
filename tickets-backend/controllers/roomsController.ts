import { Request, Response } from 'express';
import {supabase} from '../db/db'; 
import { AuthenticatedRequest } from "../types/types"; 
import { Salle } from '../types/types'; 


export const getRooms = async (
  req: Request,
  res: Response<Salle[] | { error: string }>
): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('salles')
      .select('*'); 

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json((data as Salle[]) || []);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching rooms' });
  }
};


export const getRoomById = async (
  req: Request,
  res: Response<Salle | { error: string }>
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
    res.json(data as Salle);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching room' });
  }
};


export const createRoom = async (
  req: AuthenticatedRequest,
  res: Response<Salle | { error: string }>
): Promise<void> => {
  try {
    // Check if user is logged in
    if (!req.auth?.user) {
      res.status(401).json({ error: "Unauthorized: User not logged in" });
      return;
    }

    // Check if user is admin
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("isAdmin")
      .eq("id", req.auth.user.id)
      .single();

    if (userError || !userData?.isAdmin) {
      res.status(403).json({ error: "Forbidden: User is not an admin" });
      return;
    }

    const { nom, dispo, capacity } = req.body;

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
    res.status(201).json(data as Salle);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create room' });
  }
};


export const updateRoom = async (
  req: AuthenticatedRequest,
  res: Response<Salle | { error: string }>
): Promise<void> => {
  try {
    // Check if user is logged in
    if (!req.auth?.user) {
      res.status(401).json({ error: "Unauthorized: User not logged in" });
      return;
    }

    // Check if user is admin
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("isAdmin")
      .eq("id", req.auth.user.id)
      .single();

    if (userError || !userData?.isAdmin) {
      res.status(403).json({ error: "Forbidden: User is not an admin" });
      return;
    }

    const { id } = req.params;
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
    res.json(data as Salle);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update room' });
  }
};


export const deleteRoom = async (
  req: AuthenticatedRequest,
  res: Response<{ message: string } | { error: string }>
): Promise<void> => {
  try {
    // Check if user is logged in
    if (!req.auth?.user) {
      res.status(401).json({ error: "Unauthorized: User not logged in" });
      return;
    }

    // Check if user is admin
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("isAdmin")
      .eq("id", req.auth.user.id)
      .single();

    if (userError || !userData?.isAdmin) {
      res.status(403).json({ error: "Forbidden: User is not an admin" });
      return;
    }

    const { id } = req.params;
    
    // Check if the room is used in any seances before deletion
    const { data: seancesData, error: seancesError } = await supabase
      .from("seances")
      .select("id")
      .eq("salle_id", id);

    if (seancesError) {
      res.status(400).json({ error: seancesError.message });
      return;
    }

    if (seancesData && seancesData.length > 0) {
      res.status(403).json({ error: "Cannot delete room; it is used in existing seances" });
      return;
    }

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