import bcrypt from 'bcrypt';
import { Response, Request, NextFunction } from 'express';

import _User from '../model/user.model';
import _Permission from '../model/permission.model';

import { createOtp, insertOtp } from '../utils/otp';
import {createToken} from '../auth/token/createToken';
import sendMailer from '../support/emails/otp';
import { RequestCustom } from '../middleware/auth.middleware';
import { redisClient } from '../dbs/init.redis';
import { verifyToken } from '../middleware/auth.middleware';
import { removeToken } from '../auth/token/removeToken';

export const loginService = async ({email, password, res}:{email:string, password:string, res: Response}) => {
    try{
        const user = await _User.findOne({email: email}).populate('roleId', '-_id -userId').lean();
        
        if(!user) {
            return {
                code: 403,
                message: 'User is not exist'
            }
        }
        
        const match = await bcrypt.compare(password, user.password);
        if(!match) {
            
            return {
                code: 403,
                message: 'Password is incorrect'
            }
        }
        
        const tokens = await createToken(res, user._id.toString());

        const data = {
            username: user.username,
            email: user.email,
            roleId: user.roleId, 
            _id: user._id
        }
    
        return {
            code: 201,
            message: "ok",
            data: data,
            tokens
        };
    }catch(err) {
        console.log('Error:::', err);
        return {
            code: 500,
            message: 'Error from server'
        }
    }
}

export const registerServer = async (
        {email, password, username} : 
        {email: string, password: string, username: string}
    ) => {
    try{
        const user = await _User.findOne({email: email});
        if(user) {
        return {
            code: 404,
            message: 'User existed!'
        }
        }
        const salt = await bcrypt.genSalt(10);
        const pw = await bcrypt.hash(password, salt);
        const newUser = new _User({
            username,
            email,
            password: pw
        })
        const addUser = await newUser.save();
        if(addUser) {
            // create permission
            const permit = await _Permission.create({
                user: false,
                moderator: false,
                admin: false,
                guest: true,
                userId: addUser._id
            })
            if(permit) {
                await _User.findByIdAndUpdate(addUser._id, {
                    roleId: permit._id
                })
            }

            // Create OTP
            const otp = createOtp();
            sendMailer({email, username, otp});
            return {
                code: 200,
                message: 'ok',
                data: await insertOtp(email, otp)
            }
        }

    }catch(err) {
        return {
            code: 500,
            message: 'Error from server'
        }
    }
}

export const logoutService = async(req: Request, res: Response) => {
    try {
        let access_token = req.cookies.access_token;
        let refresh_token = req.cookies.refresh_token;
        const accessTokenSecret = process.env.JWT_SECRET_TOKEN;
        const refreshTokenSecret = process.env.JWT_SECRET_REFRESH_TOKEN;
        if(access_token && refresh_token && accessTokenSecret && refreshTokenSecret) {
            const isAccessToken = await removeToken(accessTokenSecret, access_token);
            const isRefreshToken = await removeToken(refreshTokenSecret, refresh_token);

            if (isAccessToken && isRefreshToken) {  
                return {message: 'ok', code: 200}        
            } else {
                return {message: 'User not exist!', code: 400};
            }
        } else {
            return {
                message: 'Unauthorized!',
                code: 403
            }
        }
        
    }catch(err) {
        console.error(err);
        
    }
}

export const handleRefreshToken = async (
    {res, accessTokenId, refreshTokenId} :
    {res: Response, accessTokenId: string, refreshTokenId: string}
) => {
    try{
        const refreshTokenSecret = process.env.JWT_SECRET_REFRESH_TOKEN;
        const accessTokenSecret = process.env.JWT_SECRET_TOKEN;

        if (refreshTokenSecret && accessTokenSecret) {
            const isRefreshToken = await removeToken(refreshTokenSecret, refreshTokenId);
            const isAccessToken = await redisClient.del(accessTokenId);
            if(isRefreshToken && isAccessToken) {

                const tokens = await createToken(res, isRefreshToken._id.toString());

                return {message: 'ok', code: 200, data: tokens}
            }else {
                return {message: 'Token expired', code: 403};
            }
                    
        } else {
            return {message: 'Refresh Token not existed!', code: 404};
        }
    }catch(err) {
        console.error(err);
    }
}