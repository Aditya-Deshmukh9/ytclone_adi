import cors from 'cors';
import cookieParser from 'cookie-parser';
import express, { urlencoded } from 'express';

import { errorHandler } from './utils/errorHandler.js';
import authRoute from './routes/auth.route.js';

const app = express();

// middlwares
app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

// route -  /api/healthCheck
app.get('/api/healthCheck', async (_, res) => {
  try {
    return res.status(200).json({ success: true, message: 'health check OK' });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

app.use('/api/auth', authRoute);

app.use(errorHandler);

export { app };
