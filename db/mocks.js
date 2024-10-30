/*
    IMPORTANT NOTE

    THIS IS A PLACEHOLDER FOR A DATABASE AND DOES NOT SAVE DATA

    THIS FILEs ONLY WORKS WITH MOVIE WATCHLIST APP.

    PLEASE USE THE mocks.js NOTED IN HOMEWORK 1 FOR YOUR HOMEWORK 1
    (https://calstatela.instructure.com/courses/106528/files/18698555?wrap=1)
*/
const Guests = {
    guests: [
        {
            _id: 1,
            username: 'prof_auman',
            // plain text password is password123
            password:
                'fbcb9688a819e2f1e72f17258ed4e05d:7359fd3f80163d039dae0f13bbb37f30b1375d6a25cfeaf08671db4f45f952d2',
            movie_watchlist: [1, 2]
        }
    ],

    find(key, value) {
        return this.guests.find((guest) => guest[key] === value);
    },

    exists(id) {
        return this.guests.some((guest) => guest._id === id);
    },

    add(guest) {
        // create a new _id based on the current guests.length + 1
        const addGuest = { ...guest, _id: this.guests.length + 1 };
        this.guests.push(addGuest);

        return addGuest;
    },

    update(guestId, watchlistId, action) {
        const guest = this.find('_id', guestId);

        if (action === 'push') {
            guest.movie_watchlist.push(watchlistId);
        }

        if (action === 'pull') {
            guest.movie_watchlist = guest.movie_watchlist.filter((id) => id !== watchlistId);
        }

        return guest;
    }
};

const MovieWatchlist = {
    movies: [
        {
            _id: 1,
            movie: {
                movie_id: 17654,
                title: 'District 9',
                genre: 'Action',
                image: 'https://image.tmdb.org/t/p/w500/tuGlQkqLxnodDSk6mp5c2wvxUEd.jpg'
            },
            status: 'watched'
        },
        {
            _id: 2,
            movie: {
                movie_id: 198184,
                title: 'Chappie',
                genre: 'Action',
                image: 'https://image.tmdb.org/t/p/w500/hpnuXlKKWznTgbheGe4iQXzkuwJ.jpg'
            },
            status: 'pending'
        }
    ],

    find(key, value) {
        return this.movies.find((movie) => movie[key] === value);
    },

    add(movie) {
        // create a new _id based on the current movies.length + 1
        const addMovie = { ...movie, _id: this.movies.length + 1 };
        this.movies.push(addMovie);

        return addMovie;
    },

    update(watchlistId, status) {
        const movie = this.find('_id', watchlistId);
        movie.status = status;

        return movie;
    },

    delete(watchlistId) {
        this.movies = this.movies.filter((movie) => movie._id !== watchlistId);

        return watchlistId;
    }
};

export { Guests, MovieWatchlist };
