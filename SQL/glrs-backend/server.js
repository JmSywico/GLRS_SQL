import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
import gamesRouter from './routes/games.js';
import usersRouter from './routes/users.js';
import ratingsRouter from "./routes/ratings.js";


const app = express();

app.use(cors());
app.use(express.json());

app.use('/games', gamesRouter);
app.use('/users', usersRouter);
app.use("/ratings", ratingsRouter);

app.listen(process.env.PORT, () =>
  console.log(`Backend running on http://localhost:${process.env.PORT}`)
);
