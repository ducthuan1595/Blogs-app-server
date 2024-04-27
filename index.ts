import express, { Express, NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors';
import session from 'express-session';
import RedisStore from "connect-redis";
import cookieParser from 'cookie-parser';

import { initRedis, redisClient } from "./dbs/init.redis";
import init from './router/init';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({}));
app.use(cookieParser());

// init redis
(async() => {
  await initRedis();
  const redisStore = new RedisStore({
    client: redisClient
  })
  
  // save session
  app.use(session({
    secret: 'blog-app',
    resave: false,
    store: redisStore,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 5 * 60 * 1000
    }
  }))
})()


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

