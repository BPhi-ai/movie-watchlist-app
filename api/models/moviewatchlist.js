import mongoose from 'mongoose';

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

const MovieWatchlist = mongoose.model('MovieWatchlist', MovieWatchlistSchema);

export default MovieWatchlist;
