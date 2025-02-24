import express, { Application } from 'express';
const pool = require('./db'); // Import du fichier db.js
import userRoutes from './routes/users';
import filmRoutes from './routes/films';
import salleRoutes from './routes/rooms';
import seanceRoutes from './routes/screenings';
import reservationRoutes from './routes/bookings';
import ticketRoutes from './routes/tickets';

const app: Application = express();

// Middlewares
app.use(express.json());

// Mount routes
app.use('/users', userRoutes);
app.use('/films', filmRoutes);
app.use('/salles', salleRoutes);
app.use('/seances', seanceRoutes);
app.use('/reservations', reservationRoutes);
app.use('/tickets', ticketRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
