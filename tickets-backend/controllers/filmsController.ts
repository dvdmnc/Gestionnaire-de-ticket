import { Request, Response } from 'express';
import {supabase} from '../db/db';
import { FilmWithSeances, Film, Seance } from '../types/types';
import { AuthenticatedRequest } from "../types/types"; 

export const getFilms = async (
  req: Request,
  res: Response<Film[] | { error: string }>
): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('films')
      .select('id, nom, poster,genre,annee'); 

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data || []);
  } catch (err) {
    return res.status(500).json({ error: 'Server error fetching films' });
  }
};

//Supabase returns a raw data shape that doesn’t perfectly match our TypeScript interfaces.
// If we just do (rawFilm as FilmWithSeances), TypeScript complains about the “array” vs. “object” mismatch.
// Building a new object ensures we have exactly the shape we declared in our TS interfaces.
// It also avoids messy repeated type casts or partial manipulations of rawFilm in place.
export const getFilmById = async (
  req: Request,
  res: Response<{ film: FilmWithSeances } | { error: string }>
): Promise<void> => {
  const { id } = req.params;
  try {
    const { data: rawFilm, error } = await supabase
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
          salle: salles!salle_id(
            id,
            nom,
            dispo,
            capacity
          ),
          seatleft
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      res.status(404).json({ error: error.message });
      return;
    }
    if (!rawFilm) {
      res.status(404).json({ error: 'Film not found' });
      return;
    }

    // We build a new typedFilm object that matches FilmWithSeances
    const typedFilm: FilmWithSeances = {
      id: rawFilm.id,
      nom: rawFilm.nom,
      poster: rawFilm.poster,
      annee: rawFilm.annee,
      description: rawFilm.description,
      duree: rawFilm.duree,
      realisateur: rawFilm.realisateur,
      genre: rawFilm.genre,
      seances: [], // we fill this next
    };

    if (!rawFilm.seances || rawFilm.seances.length === 0) {
      res.json({ film: typedFilm });
      return;
    }

    // We convert rawFilm.seances to typed Seance objects. Turn array-of-salle into a single salle object. 
    typedFilm.seances = rawFilm.seances.map((rawSeance: any) => {
        // If salle is an array, take the first item
        let salleObj = rawSeance.salle;
        if (Array.isArray(salleObj)) {
          salleObj = salleObj[0];
        }

        const seance: Seance = {
          id: rawSeance.id,
          film_id:rawSeance.film_id,
          salle_id:rawSeance.salle_id,
          heure: rawSeance.heure,
          salle: {
            id: salleObj.id,
            nom: salleObj.nom,
            dispo: salleObj.dispo,
            capacity: salleObj.capacity,
          },
          seatleft: salleObj.seatleft 
        };

        return seance

      })

    res.json({ film: typedFilm });
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching film' });
  }
};





export const createFilm = async (
  req: AuthenticatedRequest,
  res: Response<
    { data: Film[] } |
    { error: string; missingFields?: string[] }
  >
): Promise<any> => {
  try {

    if (!req.auth?.user) {
      return res.status(401).json({ error: "Unauthorized: User not logged in" });
    }


    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("isAdmin")
      .eq("id", req.auth.user.id)
      .single();

    if (userError || !userData?.isAdmin) {
      return res.status(403).json({ error: "Forbidden: User is not an admin" });
    }
    
    const {
      nom,
      poster,
      annee,
      description,
      duree,
      realisateur,
      genre,
    } = req.body;


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

    const { data: film, error } = await supabase
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
    return res.status(201).json({ data: film });
  } catch (err) {
    return res.status(400).json({ error: 'Failed to create film: ' + err });
  }
};

export const updateFilm = async (
  req: AuthenticatedRequest,
  res: Response<Film[] | { error: string }>
): Promise<any> => {
  try {

    if (!req.auth?.user) {
      return res.status(401).json({ error: "Unauthorized: User not logged in" });
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("isAdmin")
      .eq("id", req.auth.user.id)
      .single();

    if (userError || !userData?.isAdmin) {
      return res.status(403).json({ error: "Forbidden: User is not an admin" });
    }

    const { id } = req.params;
    const {
      nom,
      poster,
      annee,
      description,
      duree,
      realisateur,
      genre,
    } = req.body;

    const { data: film, error } = await supabase
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
  req: AuthenticatedRequest,
  res: Response<
    { message: string } |
    { error: string; seances?: ConflictSeance[] }
  >
): Promise<any> => {
  console.log("Auth info:", req.auth);

  try {

    if (!req.auth?.user) {
      return res.status(401).json({ error: "Unauthorized: User not logged in" });
    }


    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("isAdmin")
      .eq("id", req.auth.user.id)
      .maybeSingle();

    if (userError || !userData || !userData.isAdmin) {
      return res.status(403).json({ error: "Forbidden: User is not an admin" });
    }

    const { id } = req.params;


    const { data: seancesData, error: seancesError } = await supabase
      .from("seances")
      .select("id, heure")
      .eq("film_id", id);

    if (seancesError) {
      return res.status(400).json({ error: seancesError.message });
    }

    if (!seancesData || seancesData.length === 0) {
 
      const { error: deleteError } = await supabase
        .from("films")
        .delete()
        .eq("id", id);

      if (deleteError) {
        return res.status(400).json({ error: deleteError.message });
      }
      return res.json({ message: `Film ${id} deleted.` });
    }

    const seanceIds = seancesData.map((s: any) => s.id);

    const { data: soldData, error: soldError } = await supabase
      .from('tickets')
      .select(`
        id,
        reservation_id (
          seance_id
        )
      `)
      .in("reservation_id.seance_id", seanceIds);

    if (soldError) {
      return res.status(400).json({ error: soldError.message });
    }

    if (soldData && soldData.length > 0) {

      const seanceIdsWithTickets = new Set(
        soldData.map((t: any) => t.reservation_id.seance_id)
      );

      const conflictSeances = seancesData.filter((s: any) =>
        seanceIdsWithTickets.has(s.id)
      );

      return res.status(403).json({
        error: "Cannot delete film; tickets sold for the following seances",
        seances: conflictSeances.map((s: any) => ({
          id: s.id,
          heure: s.heure,
        })),
      });
    }

    const { error: finalDeleteError } = await supabase
      .from('films')
      .delete()
      .eq("id", id);

    if (finalDeleteError) {
      return res.status(400).json({ error: finalDeleteError.message });
    }

    return res.json({ message: `Film ${id} deleted.` });

  } catch (err) {
    return res.status(500).json({ error: "Failed to delete film: " + err });
  }
};
