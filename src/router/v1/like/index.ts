import express from "express";

import { likeToggle, getLikers } from "../../../controller/like.controller";
import { authentication } from "../../../middleware/auth.middleware";

const route = express.Router();

route.use(authentication);

route.post('', likeToggle);
route.get('', getLikers);


export default route;
