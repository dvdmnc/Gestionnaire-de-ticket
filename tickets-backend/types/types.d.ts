
import { Request } from "express";
import { User } from "@supabase/supabase-js"; // Import User type from Supabase

// Extend Express Request type
export interface AuthenticatedRequest extends Request {
  auth?: {
    user: User;
  };
}

export interface Film {
    id?: number;
    nom: string;
    poster: string;
    annee: number;
    description?: string;
    duree?: number;
    realisateur?: string;
    genre?: string;
  }
  
 export interface Salle {
    id: number;
    nom: string;
    dispo: boolean;
    capacity: number;
    created_at?: string; 
    seats_left?: number; 
  }
  
  
 export interface FilmWithSeances extends Film {
    seances?: Seance[];
  }

  export interface Seance {
    id: number;
    film_id: number;
    salle_id: number;
    heure: string;
    prix_base?: number;
  
    salle?: Salle;
    seatleft:number;
  }
  

  export interface Booking {
    id: number;              
    user_id: string;         
    seance_id: number;       
    date_reservation: string; 
  }


export interface Ticket {
  id: number;
  reservation_id: number;
  type: string;
  num_siege: string;
  price: number;
  created_at?: string;
}


export interface User {
  id: string;         
  nom: string;
  email: string;
  password?: string;  
  created_at?: string; 
  updated_at?: string;
  isAdmin: boolean;
}


export interface UserWithBookings {
  id: string;
  nom: string;
  email: string;
  isAdmin?: boolean;
  reservations: Array<{
    id: number;
    seance_id: number;
    date_reservation: string;
    tickets: Array<{
      id: number;
      reservation_id: number;
      type: string;
      num_siege: string;
      price: number;
      created_at?: string;
    }>;
    seance: {
      id: number;
      heure: string;
      film: {
        id: number;
        nom: string;
        poster: string;
      } | null;
      salle: {
        id: number;
        nom: string;
      } | null;
    } | null;
  }>;
}




