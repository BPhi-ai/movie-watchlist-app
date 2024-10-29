import 'dotenv/config';
import express from 'express';

import movies from './api/routes/movies.js';

const app = express();
const PORT = 8080;

app.use(express.json());

app.use("/movies", movies);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
})