import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import gamesRouter from './routes/games.js';
import usersRouter from './routes/users.js';
import ratingsRouter from './routes/ratings.js';
import recommendationsRouter from './routes/recommendations.js';
import libraryRouter from './routes/library.js';
import playSessionsRouter from './routes/playSessions.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/games', gamesRouter);
app.use('/users', usersRouter);
app.use('/ratings', ratingsRouter);
app.use('/recommendations', recommendationsRouter);
app.use('/library', libraryRouter);
app.use('/play-sessions', playSessionsRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);
