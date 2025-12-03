import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
import gamesRouter from './routes/games.js';
import usersRouter from './routes/users.js';
import ratingsRouter from './routes/ratings.js';
import playSessionsRouter from './routes/playSessions.js';
import recommendationsRouter from './routes/recommendations.js';
import libraryRouter from './routes/library.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/games', gamesRouter);
app.use('/users', usersRouter);
app.use('/ratings', ratingsRouter);
app.use('/play-sessions', playSessionsRouter);
app.use('/recommendations', recommendationsRouter);
app.use('/library', libraryRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
