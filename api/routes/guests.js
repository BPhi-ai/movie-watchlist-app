/* eslint-disable camelcase */
import express from 'express';

import { Guests, MovieWatchlist } from '../../db/mocks.js';

const router = express.Router();

// POST /guests/register
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(422).json({ error: 'Must provide both username and password' });
        }

        const isRegistered = Guests.find('username', username.toLowerCase());
        if (isRegistered) {
            return res.status(409).json({ error: 'Username already registered.' });
        }

        const guest = Guests.add({
            username: username.toLowerCase(),
            password,
            movie_watchlist: []
        });

        res.json({ _id: guest._id, username: guest.username, movie_watchlist: guest.movie_watchlist });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

// POST /guests/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(422).json({ error: 'Must provide both username and password' });
        }

        const guest = Guests.find('username', username.toLowerCase());
        if (!guest || guest.password !== password) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        res.json({ _id: guest._id, username: guest.username, movie_watchlist: guest.movie_watchlist });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

// GET /guests/:id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { guest_id } = req.headers;

        if (id !== guest_id) {
            return res.status(403).json({ error: 'Forbidden guest.' });
        }

        const guest = Guests.find('_id', parseInt(id));
        if (!guest) {
            return res.status(404).json({ error: 'Guest not found' });
        }

        const watchlist = guest.movie_watchlist.map((id) => {
            const movie = MovieWatchlist.find('_id', id);
            return movie;
        });

        res.json({ guest: guest.username, watchlist });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

export default router;
