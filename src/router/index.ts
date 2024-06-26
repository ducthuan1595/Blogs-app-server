import express, { Express } from "express";

import routerV1 from './v1';

const route = express.Router();


route.use('/v1/api', routerV1);

export default route;
