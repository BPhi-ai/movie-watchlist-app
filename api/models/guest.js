import mongoose from 'mongoose';

const GuestSchema = new mongoose.Schema({
    username: {
        type: String,
        required: String,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    movie_watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MovieWatchlist' }]
});

const Guest = mongoose.model('Guest', GuestSchema);

export default Guest;
