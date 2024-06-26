import _Otp from '../model/otp.model';

import bcrypt from 'bcrypt';
import _User from '../model/user.model';
import _Permission from '../model/permission.model';

import {createOtp, insertOtp} from '../utils/otp';
import sendMailer from '../support/emails/otp';


const verifyOtpService = async({email, otp}:{email: string, otp: string}) => {
        try{
            const otpHold = await _Otp.find({email});
            if(!otpHold.length) {
                return {
                   message: 'Otp expired',
                   code: 404
                }
            }

            const lastOtp = otpHold[otpHold.length - 1];
            const isValid = await bcrypt.compare(otp, lastOtp.otp);
            if(!isValid) {
                return {
                    code: 401,
                    message: 'Invalid OTP'
                }
            }
            let user = await _User.findOne({email});
            if(user) {
                await _Otp.deleteMany({email});
                const updatePermit = await _Permission.findOneAndUpdate({_id: user.roleId}, {user: true})
                if(updatePermit){
                    user = await _User.findById(user._id).populate('roleId', '-_id -userId').select('-password');
                    return {
                        code: 201,
                        message: 'ok',
                        data: {
                            user
                        },
                    }
                }
            }

        }catch(err) {
            console.error(err);
        }
    }

const sendAgainOtpService = async({email, username}:{email: string, username: string}) => {
    try{
        const user = await _User.findOne({email});
        if(!user) {
            return {
                code: 401,
                message: 'Invalid email'
            }
        }
        await _Otp.deleteMany({email});
        const otp = createOtp();
        sendMailer({email, username, otp});
        return {
            code: 201,
            message: "ok",
            data: await insertOtp(
                email,
                otp
            )
        };
    }catch(err) {
        console.error(err);
    }
}

export {
    verifyOtpService,
    sendAgainOtpService
}