import express, { Express, Request, Response } from "express";

import { login, signup } from "../controller/auth";
import { getAllPost } from "../controller/post";

const router = express.Router();

const init = (app: Express) => {

  router.post('/v2/api/login', login);
  router.post("/v2/api/signup", signup);

  router.get('/v1/api/posts', getAllPost)

  return app.use("/", router);
};

export default init;
