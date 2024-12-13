/* eslint-disable camelcase */
import express from 'express';

import {
    addWatchlistMovie,
    updateWatchlistMovie,
    deleteWatchlistMovie
} from '../controllers/moviewatchlist.js';

import { verifyGuest } from '../middleware/authorization.js';
import { verifyGuestWatchlist } from '../middleware/validation.js';

const router = express.Router();

// POST /watchlist
router.post('/', verifyGuest, addWatchlistMovie);

// PUT /watchlist/:id
router.put('/:id', verifyGuest, verifyGuestWatchlist, updateWatchlistMovie);

// DELETE /watchlist/:id
router.delete('/:id', verifyGuest, deleteWatchlistMovie);

export default router;
