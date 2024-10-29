import express from 'express';
import axios from 'axios';

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

export default router;