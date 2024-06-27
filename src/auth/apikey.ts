import { Request, Response, NextFunction } from "express";

import { Header } from "../utils";

const apiKey = (req: Request, res: Response, next: NextFunction) => {
    try{
        const key = req.headers[Header.API_KEY];
        if(!key) {
            return res.status(403).json({
                message: 'Key missing',
                code: 403
            })
        }
        next();
    }catch(err) {
        console.log(err);
    }
}

export default apiKey;