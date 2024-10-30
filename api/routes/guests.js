/* eslint-disable camelcase */
import express from 'express';

import { hash, compare, signToken } from '../util/auth.js';
import { verifyGuest } from '../middleware/authorization.js';

import { Guests, MovieWatchlist } from '../../db/mocks.js';

const router = express.Router();

// POST /guests/register
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // ensure both username and password are provided
        if (!username || !password) {
            return res.status(422).json({ error: 'Must provide both username and password' });
        }

        // check if username is already registered
        const isRegistered = Guests.find('username', username.toLowerCase());
        if (isRegistered) {
            return res.status(409).json({ error: 'Username is already registered.' });
        }

        const hashedPassword = await hash(password);

        // add guest to the Guests collection
        const guest = Guests.add({
            username: username.toLowerCase(),
            password: hashedPassword,
            movie_watchlist: []
        });

        res.json({
            _id: guest._id,
            username: guest.username,
            movie_watchlist: guest.movie_watchlist
        });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

// POST /guests/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // ensure both username and password are in req.body
        if (!username || !password) {
            return res.status(422).json({ error: 'Must provide both username and password.' });
        }

        // find guest by username and verify password
        const guest = Guests.find('username', username.toLowerCase());
        if (!guest) {
            return res.status(401).json({ error: 'Invalid username' });
        }

        const passwordEqual = await compare(password, guest.password);
        if (!passwordEqual) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = signToken(guest.username, guest._id);

        res.json({
            _id: guest._id,
            username: guest.username,
            movie_watchlist: guest.movie_watchlist,
            token_type: 'Bearer',
            access_token: token
        });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

// GET /guests/:id
router.get('/:id', verifyGuest, async (req, res) => {
    try {
        const { guest_id } = req.verified;
        const id = Number(req.params.id);

        // ensure the guest id in header matches id provided in URL
        if (id !== guest_id) {
            return res.status(403).json({ error: 'Forbidden: You are not this guest.' });
        }

        const guest = Guests.find('_id', id);

        // add the associated watchlist details
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
