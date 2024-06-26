import express, { Express, NextFunction, Request, Response } from "express";
import cors from 'cors';
import session from 'express-session';
import RedisStore from "connect-redis";
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from "helmet";
import createError from 'http-errors';

import { initRedis, redisClient } from "./src/dbs/init.redis";
import logEvents from "./src/support/logEvents";
import routes from "./src/router";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({}));
app.use(cookieParser());
app.use(helmet());
app.use(morgan('common'));

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

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Home Page!')
})

app.use('/', routes)

app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404, 'Not found'))
})

//handle error
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logEvents(`${req.url} -- ${req.method} -- ${err.message}`);
  res.status(err.status || 500);
  res.json({
      status: err.status || 500,
      message: err.message
  })
})

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.json({
    status: err.status,
    message: err.message
  })
})

export default app
