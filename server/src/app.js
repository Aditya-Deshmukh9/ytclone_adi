import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';

import authRoute from './routes/auth.route.js';
import { logDetails } from './middlewares/logdetails.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

// middlwares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(logDetails);

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
