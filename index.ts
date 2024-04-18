import express, { Express, NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors';

import { initRedis } from "./dbs/init.redis";
import init from './router/init';
import initMongodb from "./dbs/init.mongod";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({}));

async() => {
  await initRedis();
}

init(app);

//handle error
app.use((req, res, next) => {
  const error: any = new Error('Not Found');
  error.status = 500;
  next(error)
})

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.json({
    status: err.status,
    message: err.message
  })
})

mongoose.connect(process.env.DATABASE_URL ?? '').then(() => {
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
}).catch((err) => console.log(err))

