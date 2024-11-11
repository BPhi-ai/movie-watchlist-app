/* eslint-disable camelcase */
import express from 'express';

import { registerGuest, loginGuest, getGuestById } from '../controllers/guest.js';

import { verifyGuest } from '../middleware/authorization.js';

const router = express.Router();

// POST /guests/register
router.post('/register', registerGuest);

// POST /guests/login
router.post('/login', loginGuest);

// GET /guests/:id
router.get('/:id', verifyGuest, getGuestById);

export default router;
