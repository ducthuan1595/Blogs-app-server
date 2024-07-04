import express from "express";

import { likeToggle } from "../../../controller/like.controller";
import { authentication } from "../../../middleware/auth.middleware";

const route = express.Router();

route.use(authentication);

route.post('', likeToggle);


export default route;
