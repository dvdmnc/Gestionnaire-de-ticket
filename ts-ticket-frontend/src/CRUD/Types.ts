export interface Salle {
    id: number;
    nom: string;
    dispo: boolean;
    capacity: number;
    seats_left?: number;
}
