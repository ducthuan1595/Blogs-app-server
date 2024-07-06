import express from "express";

import { pullNotify, getReadNotify, convertNotify } from "../../../controller/notification.controller";
import { authentication } from "../../../middleware/auth.middleware";

const route = express.Router();

route.use(authentication);

route.get('/unread', pullNotify);
route.get('/read', getReadNotify);
route.put('', convertNotify)


export default route;
