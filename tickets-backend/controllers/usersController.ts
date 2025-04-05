import { Request, Response } from 'express';
import {supabase, supabaseAdmin} from '../db/db'; 
import { User, UserWithBookings } from '../types/types'; 


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

    res.json((data as User[]) || []);
  } catch (err) {

    res.status(500).json({ error: 'Server error fetching users' });

  }
};


export const getUserById = async (
  req: Request,
  res: Response<UserWithBookings | { error: string }>
): Promise<void> => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        nom,
        email,
        reservations:reservations(
          id,
          seance_id,
          date_reservation,
          tickets(*),
          seance:seances!seance_id(
            id,
            heure,
            film:films!film_id(
              id,
              nom,
              poster
            ),
            salle:salles!salle_id(
              id,
              nom
            )
          )
        )
      `)
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

    const userWithBookings: UserWithBookings = {
      id: data.id,
      nom: data.nom,
      email: data.email,
      reservations: (data.reservations || []).map((r: any) => ({
        id: r.id,
        seance_id: r.seance_id,
        date_reservation: r.date_reservation,
        tickets: r.tickets || [],
        seance: r.seance
          ? {
              id: r.seance.id,
              heure: r.seance.heure,
              film: r.seance.film || null,
              salle: r.seance.salle || null,
            }
          : null,
      })),
    };

    res.json(userWithBookings);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching user' });
  }
};


export const updateUser = async (
  req: Request,
  res: Response<User | { error: string }>
): Promise<void> => {
  try {
    const { id } = req.params; 
    const { email, password, nom, isAdmin } = req.body;

    let updatedCustomUser: User | null = null;

  
    if (email || password) {
      const { data: authData, error: authError } =
        await supabaseAdmin.auth.admin.updateUserById(id, {
          email: email || undefined,
          password: password || undefined,
        });
      if (authError) {
        res.status(400).json({ error: authError.message });
        return;
      }
    }


    if (nom !== undefined || isAdmin !== undefined) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .update({ nom, isAdmin })
        .eq('id', id)
        .select()
        .single();

      if (userError) {
        res.status(400).json({ error: userError.message });
        return;
      }

      if (!userData) {
        res.status(404).json({ error: 'User not found in custom table' });
        return;
      }
      updatedCustomUser = userData as User;
    }


    if (updatedCustomUser) {
      res.json(updatedCustomUser);
      return;
    } else {

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();


      if (userData) {
        res.json(userData as User);
      } else {
        res.json({ error: 'Email/password updated in Auth, but no custom row found' });
      }
    }
  } catch (err) {
    res.status(400).json({ error: 'Failed to update user' });
  }
};



export const createUser = async (
  req: Request,
  res: Response<User | { error: string }>
): Promise<void> => {
  try {
    const { email, password, nom, isAdmin } = req.body;
    if (!email || !password || !nom || !isAdmin) {
      res.status(400).json({ error: 'Missing email, password, or nom' });
      return;
    }


    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
    });
    if (authError) {
      res.status(400).json({ error: authError.message });
      return;
    }

    if (!authData?.user) {
      res.status(500).json({ error: 'No user returned from Auth' });
      return;
    }


    const userId = authData.user.id;
    const { data: userRows, error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: userId, 
          nom,
          email,
          isAdmin:true
        },
      ])
      .select()
      .single();

    if (userError) {
      res.status(400).json({ error: userError.message });
      return;
    }

    res.status(201).json(userRows as User);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};



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
