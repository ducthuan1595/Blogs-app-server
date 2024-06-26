import app from './app';
import dotenv from "dotenv";

import mongoose from './src/dbs/init.mongod';

dotenv.config();

const port = process.env.PORT;

app.listen(port, () => {
  mongoose
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
