import express from "express";

import { pullNotify, getReadNotify } from "../../../controller/notification.controller";
import { authentication } from "../../../middleware/auth.middleware";

const route = express.Router();

route.use(authentication);

route.get('/unread', pullNotify);
route.get('/read', getReadNotify);


export default route;
