import express from "express";

import { createLike, removeLike } from "../../../controller/like.controller";
import { authentication } from "../../../middleware/auth.middleware";

const route = express.Router();

route.use(authentication);

route.post('', createLike);
route.delete('', removeLike);


export default route;
