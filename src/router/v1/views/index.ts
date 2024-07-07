import express from "express";

import { getTotalView, viewBlog } from "../../../controller/view.controller";

const route = express.Router();


route.post('', viewBlog);
route.get('', getTotalView);


export default route;
