import express from "express";

import { likeToggle, getLikers } from "../../../controller/like.controller";
import { authentication } from "../../../middleware/auth.middleware";

const route = express.Router();

route.get('', getLikers);
route.use(authentication);

route.post('', likeToggle);


export default route;
