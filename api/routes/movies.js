import express from 'express';
import axios from 'axios';

import { Guests, MovieWatchlist } from '../../db/mocks.js';

const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_API_URL = process.env.TMDB_API_URL;

// GET /movies/search?title=
router.get('/search', async (req, res) => {
    try {
        const { title } = req.query;

        // make request to TMDB API to search for movies
        const movies = await axios.get(`${TMDB_API_URL}/search/movie`, {
            params: {
                api_key: TMDB_API_KEY,
                query: title
            }
        });

        res.json(movies.data.results);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

// GET /recommendations
router.get('/recommendations', async (req, res) => {
    try {
        const guest_id = Number(req.headers.guest_id);

        // ensure guest exists
        const guest = Guests.find('_id', guest_id);
        if (!guest) {
            return res.status(404).json({ error: 'Guest not found' });
        }

        // get a movie recommendation by the last movie in guest's watchlist
        const watchlistId = guest.movie_watchlist[guest.movie_watchlist.length - 1];
        const watchlist = MovieWatchlist.find('_id', watchlistId);

        // make request to TMDB API for movie recommendations based on a movie id
        const movies = await axios.get(`${TMDB_API_URL}/movie/${watchlist.movie.movieId}/recommendations`, {
            params: {
                api_key: TMDB_API_KEY
            }
        });

        res.json(movies.data.results);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

export default router;