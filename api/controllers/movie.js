/* eslint-disable camelcase */
import axios from 'axios';

// the movie controller has no model and relies on the guest model for movie recommendations based on the guest's watchlist
import Guest from '../models/guest.js';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_API_URL = process.env.TMDB_API_URL;

const searchMovies = async (req, res) => {
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
};

const movieRecommendations = async (req, res) => {
    try {
        const { guest_id } = req.verified;

        // find guest by id and populate movie_watchlist
        const guest = await Guest.findById(guest_id)
            .select('-password')
            .populate({
                path: 'movie_watchlist', // populate the movie_watchlist
                match: { status: 'watched' } // only include movies where status is 'watched'
            });

        // get the last movie's movie_id from the guest's populated watchlist
        const { movie } = guest.movie_watchlist[guest.movie_watchlist.length - 1];

        // make request to TMDB API for movie recommendations based movie id
        const movies = await axios.get(`${TMDB_API_URL}/movie/${movie.movie_id}/recommendations`, {
            params: {
                api_key: TMDB_API_KEY
            }
        });

        res.json(movies.data.results);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const popularMovies = async (req, res) => {
    try {
        // make request to TMDB API to get popular movies
        const movies = await axios.get(`${TMDB_API_URL}/movie/popular`, {
            params: {
                api_key: TMDB_API_KEY
            }
        });

        res.json(movies.data.results);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

export { searchMovies, movieRecommendations, popularMovies };
