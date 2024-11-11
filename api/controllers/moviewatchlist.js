/* eslint-disable camelcase */

// the moviewatchlist controller imports only the moviewatchlist model as it handles actions specific to moviewatchlist
// pre/post hooks are used to handle actions related to guests without the need to import the guest model
import Moviewatchlist from '../models/moviewatchlist.js';

const addWatchlistMovie = async (req, res) => {
    try {
        const { guest_id } = req.verified;
        const movie = req.body;

        // we use `new` instead of `create` in the case because we need to add a temporary field `guest_id`
        // the `create` method constructs and saves the document in a single one and will not allow us access to `guest_id`
        const watchlistMovie = new Moviewatchlist({
            movie: {
                movie_id: movie.movie_id,
                title: movie.title,
                genres: movie.genres,
                image: `https://image.tmdb.org/t/p/w500${movie.image}`
            },
            status: 'pending' // default status
        });

        // add a guest_id as a temporary field on the instance
        // this allow us to access the guest_id in pre/post hooks WITHOUT saving it in the document
        watchlistMovie._guest_id = guest_id;

        // save the watchlistMovie document
        await watchlistMovie.save();

        res.json(watchlistMovie);
    } catch (error) {
        // catch any errors that happen during the database operations
        // respond with a 500 and the error message
        res.status(500).json({ error: error.toString() });
    }
};

const updateWatchlistMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // use findByIdAndUpdate to find a watchlist movie by its _id and update status
        const watchlistMovie = await Moviewatchlist.findByIdAndUpdate(
            id,
            { status }, // update the status
            { new: true } // return the updated document
        );

        if (!watchlistMovie) {
            return res.status(404).json({ error: 'Watchlist movie not found' });
        }

        res.json(watchlistMovie);
    } catch (error) {
        // catch any errors that happen during the database operations
        // respond with a 500 and the error message
        res.status(500).json({ error: error.toString() });
    }
};

const deleteWatchlistMovie = async (req, res) => {
    try {
        const { guest_id } = req.verified;
        const { id } = req.params;

        const watchlistMovie = await Moviewatchlist.findById(id);

        if (!watchlistMovie) {
            return res.status(404).json({ error: 'Watchlist movie not found' });
        }

        // add a guest_id as a temporary field on the instance
        // this allow us to access the guest_id in pre/post hooks
        watchlistMovie._guest_id = guest_id;

        // use the deleteOne method to remove the watchlist movie
        await watchlistMovie.deleteOne();

        res.json({ watchlist_id: watchlistMovie._id, delete: 'success' });
    } catch (error) {
        // catch any errors that happen during the database operations
        // respond with a 500 and the error message
        res.status(500).json({ error: error.toString() });
    }
};

export { addWatchlistMovie, deleteWatchlistMovie, updateWatchlistMovie };
