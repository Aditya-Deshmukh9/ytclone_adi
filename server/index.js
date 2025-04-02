import 'dotenv/config';
import { app } from './src/app.js';
import { SERVER_PORT } from './src/constants.js';

app.listen(SERVER_PORT, () =>
  console.log(`server running on Port: ${SERVER_PORT}`)
);
