import { Request, Response } from 'express';
import {supabase} from '../db/db';
import { Seance } from '../types/types';
import { AuthenticatedRequest } from "../types/types";

export const getScreenings = async (
  req: Request,
  res: Response<Seance[] | { error: string }>
): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('seances')
      .select('*'); 

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json((data as Seance[]) || []);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching seances' });
  }
};


export const getScreeningById = async (
  req: Request,
  res: Response<Seance | { error: string }>
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
    res.json(data as Seance);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching seance' });
  }
};

export const createScreening = async (
  req: AuthenticatedRequest,
  res: Response<Seance | { error: string }>
): Promise<void> => {
  try {
    if (!req.auth?.user) {
      res.status(401).json({ error: "Unauthorized: User not logged in" });
      return;
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("isAdmin")
      .eq("id", req.auth.user.id)
      .single();

    if (userError || userData?.isAdmin !== true) {
      res.status(403).json({ error: "Forbidden: User is not an admin" });
      return;
    }

    const { film_id, salle_id, heure } = req.body;

    if (
      film_id == null ||
      salle_id == null ||
      !heure 
    ) {
      res.status(400).json({ error: 'Missing fields' });
      return;
    }

    const { data, error } = await supabase
      .from('seances')
      .insert([{ film_id, salle_id, heure }])
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(201).json(data as Seance);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create screening' });
  }
};


export const updateScreening = async (
  req: AuthenticatedRequest,
  res: Response<Seance| { error: string }>
): Promise<void> => {
  try {
    if (!req.auth?.user) {
      res.status(401).json({ error: "Unauthorized: User not logged in" });
      return;
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("isAdmin")
      .eq("id", req.auth.user.id)
      .single();

    if (userError || userData?.isAdmin !== true) {
      res.status(403).json({ error: "Forbidden: User is not an admin" });
      return;
    }

    const { id } = req.params;
    const { film_id, salle_id, heure } = req.body;

    // Check if there are any tickets sold for this screening
    const { data: reservations, error: reservationsError } = await supabase
      .from('reservations')
      .select('id')
      .eq('seance_id', id);

    if (reservationsError) {
      res.status(400).json({ error: reservationsError.message });
      return;
    }

    if (reservations && reservations.length > 0) {
      // If tickets are sold, only allow updates to certain fields, not salle_id or time
      const { data, error } = await supabase
        .from('seances')
        .update({ film_id })
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
      res.json(data as Seance);
      return;
    }

    // If no tickets are sold, allow full update
    const { data, error } = await supabase
      .from('seances')
      .update({ film_id, salle_id, heure })
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
    res.json(data as Seance);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update screening' });
  }
};


export const deleteScreening = async (
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

    // Strict comparison of isAdmin to true
    if (userError || userData?.isAdmin !== true) {
      res.status(403).json({ error: "Forbidden: User is not an admin" });
      return;
    }

    const { id } = req.params;
    
    // Check if there are tickets sold for this screening
    const { data: reservations, error: reservationsError } = await supabase
      .from('reservations')
      .select('id')
      .eq('seance_id', id);

    if (reservationsError) {
      res.status(400).json({ error: reservationsError.message });
      return;
    }

    if (reservations && reservations.length > 0) {
      res.status(403).json({ error: 'Cannot delete screening with existing reservations' });
      return;
    }

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