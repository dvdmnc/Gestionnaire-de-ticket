export class User {
    id?: string;
    nom?: string;
    email?: string;
    created_at?: Date;
    _at?: Date


    constructor(user: User) {
        this.id = user.id;
        this.nom = user.nom;
        this.email = user.email;
        this.created_at = user.created_at;
        this._at = user._at;
    }
}
