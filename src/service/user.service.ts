import bcrypt from 'bcrypt';
import { Response, Request, NextFunction } from 'express';

import _User from '../model/user.model';
import _Permission from '../model/permission.model';

import { createOtp, insertOtp } from '../utils/otp';
import {createToken, createRefreshToken} from '../auth/createToken';
import sendMailer from '../support/emails/otp';
import { RequestCustom } from '../middleware/auth.middleware';
import { redisClient } from '../dbs/init.redis';
import { UserType } from '../types';
import { verifyToken } from '../middleware/auth.middleware';

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

        const data = {
            username: user.username,
            email: user.email,
            roleId: user.roleId, 
        }
    
        return {
            code: 201,
            message: "ok",
            data: data,
            token: {
                refreshToken: refresh_token,
                accessToken: access_token
            }
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
        const tokenId = req.cookies.access_token;
        
        const token = await redisClient.get(tokenId);
        const tokenSecret = process.env.JWT_SECRET_TOKEN;
        if (tokenSecret && token) {
            
            const user = await verifyToken(tokenId);
            if(user) {
                
                await redisClient.del(tokenId);
                return {message: 'ok', code: 200}
            }else {
                return {message: 'Token expired', code: 403};
            }
                    
        } else {
            return {message: 'User existed!', code: 403};
        }
        
    }catch(err) {
        console.error(err);
        
    }
}