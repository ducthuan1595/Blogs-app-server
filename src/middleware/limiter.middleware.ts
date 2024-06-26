import { Request, Response, NextFunction } from "express";
import { expired, ttl, incr } from '../utils/limiter';

const limiterApi = async(req: Request, res: Response, next: NextFunction) => {
    const getIPUser = (req.headers['x-forwarded-for'] || req.connection.remoteAddress) as string;

    const numRequest: number = await incr(getIPUser);
    let _ttl;
    if(numRequest === 1) {
        await expired(getIPUser, 60);
        _ttl = 60;
    }else {
        _ttl = await ttl(getIPUser);
    }

    if(numRequest > 10) {
        return res.status(503).json({
            code: 503,
            message: 'Server is busy',
            _ttl, numRequest
        })
    }

    next();
}

export default limiterApi;