import { Response } from 'express';
import bcrypt from 'bcrypt';

import _Otp from '../model/otp.model';
import _User from '../model/user.model';
import _Permission from '../model/permission.model';

import {createOtp, insertOtp} from '../utils/otp';
import sendMailer from '../support/emails/otp';
import { createToken, createRefreshToken } from '../auth/createToken';


const verifyOtpService = async({email, otp, res}:{email: string, otp: string, res: Response}) => {
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
                    const refresh_token = await createRefreshToken(user._id.toString())
        
                    const access_token = await createToken(user._id.toString())
                
                    res.cookie('access_token', access_token, {
                    maxAge: 365 * 24 * 60 * 60 * 100,
                    httpOnly: true,
                    //secure: true;
                    });
                    res.cookie('refresh_token', refresh_token, {
                    maxAge: 365 * 24 * 60 * 60 * 100,
                    httpOnly: true,
                    //secure: true;
                    });
                    return {
                        code: 201,
                        message: 'ok',
                        data: {
                            user,
                            token: {
                                accessToken: access_token,
                                refreshToken: refresh_token
                            }
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