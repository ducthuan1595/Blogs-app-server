import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors';

import {initRedis} from "./config/redisClient";
import init from './router/init';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({}));

// initRedis();


init(app);

mongoose.connect(process.env.DATABASE_URL ?? '').then(() => {
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
}).catch((err) => console.log(err))

