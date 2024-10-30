/* eslint-disable camelcase */
import express from 'express';

import { Guests, MovieWatchlist } from '../../db/mocks.js';

const router = express.Router();

// POST /watchlist
router.post('/', async (req, res) => {
    try {
        const guest_id = Number(req.headers.guest_id);
        const movie = req.body;

        // ensure guest exists
        const guest = Guests.find('_id', guest_id);

        if (!guest) {
            return res.status(404).json({ error: 'Guest not found' });
        }

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
        Guests.update(guest._id, addToWatchlist._id, 'push');

        res.json(addToWatchlist);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

// DELETE /watchlist/:id
router.delete('/:id', async (req, res) => {
    try {
        const guest_id = Number(req.headers.guest_id);
        const id = Number(req.params.id);

        // ensure guest exists
        const guest = Guests.find('_id', guest_id);
        if (!guest) {
            return res.status(404).json({ error: 'Guest not found' });
        }

        // delete the movie from the watchlist by id
        const watchlist_id = MovieWatchlist.delete(id);

        // update the guest watchlist to remove the movie id
        Guests.update(guest._id, watchlist_id, 'pull');

        res.json({ watchlist_id, delete: 'success' });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

export default router;