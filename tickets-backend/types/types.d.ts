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
  

 export interface FilmListing {
    id: number;
    nom: string;
    poster: string;
    annee: number;
    genre: string;
  }
  
 export interface Salle {
    id: number;
    nom: string;
    dispo: boolean;
    capacity: number;
    seats_left?: number; 
  }
  
 export interface Seance {
    id: number;
    heure: string; 
    salles: Salle;
  }
  
  
 export interface FilmWithSeances extends Film {
    seances?: Seance[];
  }

  export interface Booking {
    id: number;              
    user_id: string;         
    seance_id: number;       
    date_reservation: string; 
  }


export interface Room {
  id: number;
  nom: string;
  dispo: boolean;
  capacity: number;
  created_at?: string; 
}

export interface Screening {
  id: number;
  film_id: number;
  salle_id: number;
  heure: string;    
  prix_base: number;
  created_at?: string;
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
}




  