const Guests = {
    guests: [
        {
            _id: 1,
            username: 'prof_auman',
            password: 'password', // this will be hashed in HW2
            movie_watchlist: [1, 2]
        }
    ],

    find(key, value) {
        return this.guests.find((guest) => guest[key] === value);
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
                movieId: 17654,
                title: 'District 9',
                genre: 'Action',
                image: 'https://image.tmdb.org/t/p/w500/tuGlQkqLxnodDSk6mp5c2wvxUEd.jpg'
            },
            status: 'watched'
        },
        {
            _id: 2,
            movie: {
                movieId: 198184,
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
