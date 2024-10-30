/*
    steps to run:
    1. install dependencies: npm install
    2. start the server with nodemon: npm run dev
*/

import 'dotenv/config';
import express from 'express';

import mockDB from './db/connection.js';

import movies from './api/routes/movies.js';
import guests from './api/routes/guests.js';
import watchlist from './api/routes/watchlist.js';

const app = express();
const PORT = 8080;

app.use(express.json());

// handle all requests to /movies route with movies router
app.use('/movies', movies);

// handle all requests to /guests route with guests router
app.use('/guests', guests);

// handle all requests to /watchlist route with watchlist router
app.use('/watchlist', watchlist);

app.listen(PORT, async () => {
    // simulate connectioning to a database before starting the server
    await mockDB.connect();

    // log the server's URL and port to the console
    console.log(`Server is running on http://localhost:${PORT}`);
});
