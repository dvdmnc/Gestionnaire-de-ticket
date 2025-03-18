import express, { Application } from 'express';
const pool = require('./db'); // Import du fichier db.js
const cors = require('cors');
import userRoutes from './routes/users';
import filmRoutes from './routes/films';
import salleRoutes from './routes/rooms';
import seanceRoutes from './routes/screenings';
import reservationRoutes from './routes/bookings';
import ticketRoutes from './routes/tickets';

import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';

const app: Application = express();

// Middlewares
app.use(express.json());
app.use(cors()); // Enables CORS for all routes

// Mount routes
app.use('/users', userRoutes);
app.use('/films', filmRoutes);
app.use('/salles', salleRoutes);
app.use('/seances', seanceRoutes);
app.use('/reservations', reservationRoutes);
app.use('/tickets', ticketRoutes);

dotenv.config();

app.use(express.json());

app.use('/auth', authRoutes);

app.use(cors({
    origin: "http://localhost:3000", // Allow requests only from this origin
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
