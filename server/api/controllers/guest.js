/* eslint-disable camelcase */

// the guest controller imports only the guest model as it handles actions specific to guests
import Guest from '../models/guest.js';

import { hash, compare, signToken } from '../util/auth.js';

const registerGuest = async (req, res) => {
    try {
        const { username, password } = req.body;

        // ensure both username and password are provided
        if (!username || !password) {
            return res.status(422).json({ error: 'Must provide both username and password' });
        }

        const hashedPassword = await hash(password);

        // add guest to the Guests collection
        const guestEntry = await Guest.create({
            username,
            password: hashedPassword,
            movie_watchlist: []
        });

        res.json({
            _id: guestEntry._id,
            username: guestEntry.username,
            movie_watchlist: guestEntry.movie_watchlist
        });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const loginGuest = async (req, res) => {
    try {
        const { username, password } = req.body;

        // ensure both username and password are in req.body
        if (!username || !password) {
            return res.status(422).json({ error: 'Must provide both username and password.' });
        }

        // find guest by username and verify password
        const guestEntry = await Guest.findOne({ username: username.toLowerCase() });
        if (!guestEntry) {
            return res.status(401).json({ error: 'Invalid username' });
        }

        const passwordEqual = await compare(password, guestEntry.password);
        if (!passwordEqual) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = signToken(guestEntry.username, guestEntry._id);

        res.json({
            _id: guestEntry._id,
            username: guestEntry.username,
            movie_watchlist: guestEntry.movie_watchlist,
            token_type: 'Bearer',
            access_token: token
        });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const getGuestById = async (req, res) => {
    try {
        const { guest_id } = req.verified;
        const { id } = req.params;

        // ensure the guest id in header matches id provided in URL
        if (id !== guest_id) {
            return res.status(403).json({ error: 'Forbidden: You are not this guest.' });
        }

        const guestWithWatchlist = await Guest.findById(id)
            .select('-password')
            .populate('movie_watchlist');

        res.json(guestWithWatchlist);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

export { registerGuest, loginGuest, getGuestById };
