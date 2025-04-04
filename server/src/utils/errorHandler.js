import { NODE_ENV } from '../constants.js';

// Middleware to handle errors globally
export const errorHandler = (err, req, res, next) => {
  console.log(err.stack);

  const statusCode = res.statusCode === 200 ? 500 : req.statusCode;

  res.status(statusCode).json({
    message: err.message || 'Something went wrong',
    stack: NODE_ENV === 'production' ? null : err.stack,
  });
};
