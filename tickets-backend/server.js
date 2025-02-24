const express = require('express');
const pool = require('./db'); // Import du fichier db.js

const app = express();
app.use(express.json());

// Route pour tester la connexion
app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Users');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
