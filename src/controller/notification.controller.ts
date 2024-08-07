import { Response, Request } from "express";
import { RequestCustom } from "../middleware/auth.middleware";
import { pullNotifyFromClient, getReadNotifyService, convertNotifyRead } from "../service/notification.service";

const pullNotify = async (req: RequestCustom, res: Response) => {
    try{
        const {
            key = 'ALL'
        } = req.query;
        if(!req.user) {
            return res.status(403).json({message: 'Unauthorized', code: 403})
        }

        const data = await pullNotifyFromClient(req.user, key.toString());
        res.status(200).json({message: 'ok', data: data, code: 200})
    }catch(err) {
        res.status(500).json({message: 'Error from server', code: 500})
    }
}


const getReadNotify = async (req: RequestCustom, res: Response) => {
    try{
        const {
            key = 'ALL'
        } = req.query;
        if(!req.user) {
            return res.status(403).json({message: 'Unauthorized', code: 403})
        }

        const data = await getReadNotifyService(req.user, key.toString());
        res.status(200).json({message: 'ok', data: data, code: 200})
    }catch(err) {
        res.status(500).json({message: 'Error from server', code: 500})
    }
}

const convertNotify = async(req: Request, res: Response) => {
    try{
        const {notifyId} = req.body;
        if(!notifyId) {
            return res.status(404).json({message: 'Not found', code: 404})
        }
        const data = await convertNotifyRead(notifyId);
        if(data) {
            res.status(data.code).json({message: data.message, code: data.code})
        }
    }catch(err) {
        res.status(500).json({message: 'Error from server', code: 500})
    }
}

export {
    pullNotify,
    getReadNotify,
    convertNotify
}