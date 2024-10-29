import 'dotenv/config';
import express from 'express';

import movies from './api/routes/movies.js';
import guests from './api/routes/guests.js';

const app = express();
const PORT = 8080;

app.use(express.json());

app.use("/movies", movies);
app.use("/guests", guests);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
})