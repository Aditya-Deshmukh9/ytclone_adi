import 'dotenv/config';
import { app } from './src/app.js';
import { SERVER_PORT } from './src/constants.js';
import connectDB from './src/db/connectDB.js';

connectDB()
  .then(() => {
    app.listen(SERVER_PORT, () =>
      console.log(`server running on Port: ${SERVER_PORT}`)
    );
  })
  .catch((err) => {
    console.log(`Mongodb connection failed `, err);
  });
