/* eslint-disable camelcase */
import mongoose from 'mongoose';

const GENRES_MAP = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Science Fiction',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western'
};

const MovieWatchlistSchema = new mongoose.Schema({
    movie: {
        movie_id: {
            type: Number,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        genres: {
            type: [String],
            required: true
        },
        image: {
            type: String,
            required: true
        }
    },
    status: {
        type: String,
        enum: ['watched', 'pending'],
        required: true
    }
});

MovieWatchlistSchema.pre('save', function (next) {
    try {
        const genreIds = this.movie.genres;
        const stringGenres = genreIds.map((id) => GENRES_MAP[id]);

        this.movie.genres = stringGenres;
        next();
    } catch (error) {
        next(error);
    }
});

MovieWatchlistSchema.post('save', async function (doc) {
    try {
        const guest_id = this._guest_id;

        const Guest = mongoose.model('Guest');
        await Guest.findByIdAndUpdate(guest_id, { $addToSet: { movie_watchlist: doc._id } });
    } catch (error) {
        console.error(`Error in post hook for addToWatchlist: ${error}`);
    }
});

MovieWatchlistSchema.post('deleteOne', { document: true }, async function (doc) {
    try {
        const guest_id = this._guest_id;
        const Guest = mongoose.model('Guest');

        await Guest.findByIdAndUpdate(guest_id, { $pull: { movie_watchlist: doc._id } });
    } catch (error) {
        console.error(`Error in post hook for deleteWatchlistMovie: ${error}`);
    }
});

const MovieWatchlist = mongoose.model('MovieWatchlist', MovieWatchlistSchema);

export default MovieWatchlist;
