/* eslint-disable camelcase */
import Guest from '../models/guest.js';

// express.js middleware for verifying guest owns movie watchlist
const verifyGuestWatchlist = async (req, res, next) => {
    try {
        // access guest_id from the request headers
        const { guest_id } = req.verified;

        // access watchlist_id from the route path parameter
        const watchlist_id = req.params.id;

        // verify the guest owns the movie watchlist item
        const guest = await Guest.findById(guest_id).select('movie_watchlist');
        if (!guest.movie_watchlist.includes(watchlist_id)) {
            return res.status(401).json({ error: 'Movie is not in the movie watchlist' });
        }

        // pass control to the next middleware or to route handler
        next();
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

export { verifyGuestWatchlist };
