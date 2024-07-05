import { Response, Request } from "express";

import { verifyOtpService, sendAgainOtpService } from '../service/otp.service';

import { verifyOtpValidate, sendAgainOtpValidate } from '../support/validation/otp.validation';

const verifyOtp = async(req: Request, res: Response) => {
    try{
        const {email, otp} = req.body;
        console.log(req.body);
        
        const {error} = verifyOtpValidate(req.body);
        if(error) {
            return res.status(400).json({
                message: error.details[0].message,
                code: 400
            })
        }

        const data = await verifyOtpService({email, otp, res});
        if(data) {
            return res.status(data.code).json(data)
        }

    }catch(err) {
        console.log(err);
        res.status(500).json({message: 'Error from server', code: 500})
    }
}

const sendAgainOtp = async(req: Request, res: Response) => {
    try{
        const {email, username} = req.body;
        const {error} = sendAgainOtpValidate(req.body);
        if(error) {
            return res.status(400).json({
                message: error.details[0].message,
                code: 400
            })
        }

        const data = await sendAgainOtpService({email, username});
        if(data) {
            return res.status(data.code).json(data)
        }
    }catch(err) {
        res.status(500).json({message: 'Error from server', code: 500})
    }
}

export {
    verifyOtp,
    sendAgainOtp
}