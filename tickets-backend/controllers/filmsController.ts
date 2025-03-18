import { Request, Response } from 'express';
import pool from '../db';
import { FilmListing, FilmWithSeances, Film } from '../types/types';

export const getFilms = async (
  req: Request,
  res: Response<FilmListing[] | { error: string }>
): Promise<any> => {
  try {
    const { data, error } = await pool
      .from('films')
      .select('id, nom, poster,genre,annee'); // Only fields we need for listing

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    // If no rows, data might be null, so return []
    return res.json(data || []);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error fetching films' });
  }
};


export const getFilmById = async (
  req: Request,
  res: Response<{ film: FilmWithSeances } | { error: string }>
): Promise<any> => {
  const { id } = req.params;
  try {
    const { data: film, error } = await pool
      .from('films')
      .select(`
        id,
        nom,
        poster,
        annee,
        description,
        duree,
        realisateur,
        genre,
        seances(
          id,
          heure,
          salles(
            id,
            nom,
            dispo,
            capacity
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: error.message });
    }
    if (!film) {
      return res.status(404).json({ error: 'Film not found' });
    }

    // If there are no seances, we can just return the film
    if (!film.seances || film.seances.length === 0) {
      return res.json(film);
    }

    
    for (const seance of film.seances) {
      const salleCapacity = seance.salles.capacity;

      // 1) Reservations for this seance
      const { data: reservations, error: reservationsErr } = await pool
        .from('reservations')
        .select('id')
        .eq('seance_id', seance.id);

      if (reservationsErr) {
        throw new Error(reservationsErr.message);
      }

      let ticketsSold = 0;
      if (reservations && reservations.length > 0) {
        // 2) Tickets for these reservations
        const reservationIds = reservations.map((r :any) => r.id);

        const { data: tickets, error: ticketsErr } = await pool
          .from('tickets')
          .select('id')
          .in('reservation_id', reservationIds);

        if (ticketsErr) {
          throw new Error(ticketsErr.message);
        }

        ticketsSold = tickets ? tickets.length : 0;
      }

      const seatsLeft = salleCapacity - ticketsSold;
      // Attach seats_left to the salle object
      seance.salles.seats_left = seatsLeft;
    }

    return res.json({film});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error fetching film' });
  }
};



export const createFilm = async (
  req: Request,
  res: Response<
    { data: Film[] } |
    { error: string; missingFields?: string[] }
  >
): Promise<any> => {
  try {
    const {
      nom,
      poster,
      annee,
      description,
      duree,
      realisateur,
      genre,
    } = req.body;

    // 1) Validate required fields
    const missingFields: string[] = [];
    if (!nom) missingFields.push('nom');
    if (!poster) missingFields.push('poster');
    if (!annee) missingFields.push('annee');
    if (!description) missingFields.push('description');
    if (!duree) missingFields.push('duree');
    if (!realisateur) missingFields.push('realisateur');
    if (!genre) missingFields.push('genre');

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing fields',
        missingFields,
      });
    }

    // 2) Insert if valid
    const { data: film, error } = await pool
      .from('films')
      .insert([{
        nom,
        poster,
        annee,
        description,
        duree,
        realisateur,
        genre,
      }])
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(201).json({data:film});
  } catch (err) {
    return res.status(400).json({ error: 'Failed to create film' + err });
  }
};


export const updateFilm = async (
  req: Request,
  res: Response<Film[] | { error: string }>
): Promise<any> => {
  const { id } = req.params;
  try {
    const {
      nom,
      poster,
      annee,
      description,
      duree,
      realisateur,
      genre,
    } = req.body;

    const { data:film, error } = await pool
      .from('films')
      .update({
        nom,
        poster,
        annee,
        description,
        duree,
        realisateur,
        genre,
      })
      .eq('id', id)
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.json(film);
  } catch (err) {
    return res.status(400).json({ error: 'Failed to update film' });
  }
};


interface ConflictSeance {
  id: number;
  heure: string;
}

export const deleteFilm = async (
  req: Request,
  res: Response<
    { message: string } |
    { error: string; seances?: ConflictSeance[] }
  >
): Promise<any> =>{
  const { id } = req.params;
  try {
    // 1) Find all seances for this film
    const { data: seancesData, error: seancesError } = await pool
      .from('seances')
      .select('id, heure')
      .eq('film_id', id);

    if (seancesError) {
      return res.status(400).json({ error: seancesError.message });
    }

    if (!seancesData || seancesData.length === 0) {
      // No seances => safe to delete
      const { error: deleteError } = await pool
        .from('films')
        .delete()
        .eq('id', id);

      if (deleteError) {
        return res.status(400).json({ error: deleteError.message });
      }
      return res.json({ message: `Film ${id} deleted.` });
    }

    // 2) Check if any seance has tickets sold
    //    We'll gather seance IDs
    const seanceIds = seancesData.map((s : any) => s.id);


    const { data: soldData, error: soldError } = await pool
      .from('tickets')
      .select(`
        id,
        reservation_id (
          seance_id
        )
      `)
      .in('reservation_id.seance_id', seanceIds);

    if (soldError) {
      return res.status(400).json({ error: soldError.message });
    }

    if (soldData && soldData.length > 0) {
      // We have tickets sold; find which seances are used
      const seanceIdsWithTickets = new Set(
        soldData.map((t: any) => t.reservation_id.seance_id)
      );

      // Filter the original seancesData to find those seances that have tickets
      const conflictSeances = seancesData.filter((s: any) =>
        seanceIdsWithTickets.has(s.id)
      );

      // Return a 403 with the conflicting seances heures
      return res.status(403).json({
        error: 'Cannot delete film; tickets sold for the following seances',
        seances: conflictSeances.map((s: any) => ({
          id: s.id,
          heure: s.heure,
        })),
      });
    }

    // 3) If no tickets sold, we can safely delete
    const { error: finalDeleteError } = await pool
      .from('films')
      .delete()
      .eq('id', id);

    if (finalDeleteError) {
      return res.status(400).json({ error: finalDeleteError.message });
    }

    return res.json({ message: `Film ${id} deleted.` });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete film' });
  }
};
