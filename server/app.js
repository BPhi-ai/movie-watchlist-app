/*
    steps to run:
    1. install dependencies: npm install
    2. start the server with nodemon: npm run dev
*/
import cors from 'cors';
import 'dotenv/config';
import express from 'express';

import mongodb from './db/connection.js';

import movie from './api/routes/movie.js';
import guest from './api/routes/guest.js';
import watchlist from './api/routes/watchlist.js';

const app = express();
const PORT = 8080;

const options = { exposedHeader: ['Authorization'] };
app.use(cors(options));

app.use(express.json());

// handle all requests to /movies route with movies router
app.use('/movies', movie);

// handle all requests to /guests route with guests router
app.use('/guests', guest);

// handle all requests to /watchlist route with watchlist router
app.use('/watchlist', watchlist);

app.listen(PORT, async () => {
    // connecting to mongo db before starting the server
    await mongodb.connect();

    // log the server's URL and port to the console
    console.log(`Server is running on http://localhost:${PORT}`);
});
