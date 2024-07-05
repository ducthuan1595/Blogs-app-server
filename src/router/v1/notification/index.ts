import express from "express";

import { pullNotify } from "../../../controller/notification.controller";
import { authentication } from "../../../middleware/auth.middleware";

const route = express.Router();

route.use(authentication);

route.get('', pullNotify);


export default route;
