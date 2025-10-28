// src/app.js
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api', routes);

app.get('/', (req, res) => res.send('🌟 API Server is up!'));

app.use(errorHandler);

export default app;
