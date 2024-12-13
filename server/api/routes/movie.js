import express from 'express';

import { verifyGuest } from '../middleware/authorization.js';
import { searchMovies, movieRecommendations, popularMovies } from '../controllers/movie.js';

const router = express.Router();

// GET /movies/search?title=
router.get('/search', searchMovies);

// GET /recommendations
router.get('/recommendations', verifyGuest, movieRecommendations);

// GET /movies/popular
router.get('/popular', popularMovies);

export default router;
