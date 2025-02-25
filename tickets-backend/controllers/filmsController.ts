import { Request, Response } from 'express';
const pool = require('../db'); // Your Supabase client


export const getFilms = async (req: Request, res: Response): Promise<any> => {
  try {
    const { data: filmRows, error: filmError } = await pool
      .from('films')
      .select('id, nom, poster'); 

    if (filmError) {
      return res.status(500).json({ error: filmError.message });
    }
    if (!filmRows) {
      return res.json([]); 
    }


    const enrichedFilms = [];
    for (const film of filmRows) {
      const { data: seanceRows, error: seanceError } = await pool
        .from('seances')
        .select(`
          id,
          heure,
          salle_id,
          salles (
            id,
            nom,
            dispo,
            capacity
          )
        `)
        .eq('film_id', film.id);

      if (seanceError) {
        return res.status(500).json({ error: seanceError.message });
      }


      let seancesWithSalle: any[] = [];
      if (seanceRows) {

        seancesWithSalle = await Promise.all(
          seanceRows.map(async (seance: any) => {
            const salle = seance.salles; 
            const salleCapacity = salle.capacity;


            const { data: ticketCountData, error: ticketCountErr } = await pool
              .from('tickets')
              .select('id', { count: 'exact' })
              .eq('reservation_id.reservations.seance_id', seance.id);

            if (ticketCountErr) {
              throw new Error(ticketCountErr.message);
            }
            const ticketsSold = (ticketCountData?.length) || 0;
            const seatsLeft = salleCapacity - ticketsSold;

            return {
              id: seance.id,
              heure: seance.heure,
              salle: {
                id: salle.id,
                nom: salle.nom,
                dispo: salle.dispo,
                capacity: salle.capacity,
                seats_left: seatsLeft,
              },
            };
          })
        );
      }

      enrichedFilms.push({
        id: film.id,
        nom: film.nom,
        poster: film.poster,
        seances: seancesWithSalle,
      });
    }

    return res.json(enrichedFilms);
  } catch (err: any) {
    console.error(err);
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
    const { data, error } = await pool
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
    const {
      nom,
      poster,
      annee,
      description,
      duree,
      realisateur,
      genre,
    } = req.body;

    const { data, error } = await pool
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

    // If any tickets exist for those seances => forbid
    // We'll do a query that finds all reservations/tickets for these seances
    // If found, we collect the hours => return 403
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
