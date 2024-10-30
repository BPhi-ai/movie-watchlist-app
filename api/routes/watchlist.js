/* eslint-disable camelcase */
import express from 'express';

import { verifyGuest } from '../middleware/authorization.js';

import { Guests, MovieWatchlist } from '../../db/mocks.js';

const router = express.Router();

router.use(verifyGuest);

// POST /watchlist
router.post('/', async (req, res) => {
    try {
        const { guest_id } = req.verified;
        const movie = req.body;

        // add a movie to the watchlist with default 'pending' status
        const addToWatchlist = MovieWatchlist.add({
            movie: {
                movie_id: movie.movie_id,
                title: movie.title,
                genre: movie.genre,
                image: `https://image.tmdb.org/t/p/w500${movie.image}`
            },
            status: 'pending' // default status
        });

        // update the guest movie watchlist by adding the new movie id
        Guests.update(guest_id, addToWatchlist._id, 'push');

        res.json(addToWatchlist);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

// PUT /watchlist/:id
router.put('/:id', async (req, res) => {
    try {
        const { guest_id } = req.verified;
        const id = Number(req.params.id);
        const { status } = req.body;

        // ensure guest exists
        const guest = await Guests.find('_id', guest_id);

        // ensure the guest owns the watchlist item
        if (!guest.movie_watchlist.includes(id)) {
            return res.status(403).json({ error: 'Forbidden: You do not own this watchlist.' });
        }

        // find the movie in the watchlist by id
        const movie = MovieWatchlist.find('_id', id);
        if (!movie) {
            return res.status(404).json({ error: 'Watchlist movie not found.' });
        }

        // update the movie status in the watchlist
        const updated = MovieWatchlist.update(id, status);

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

// DELETE /watchlist/:id
router.delete('/:id', async (req, res) => {
    try {
        const { guest_id } = req.verified;
        const id = Number(req.params.id);

        // delete the movie from the watchlist by id
        const watchlist_id = MovieWatchlist.delete(id);

        // update the guest watchlist to remove the movie id
        Guests.update(guest_id, watchlist_id, 'pull');

        res.json({ watchlist_id, delete: 'success' });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

export default router;
