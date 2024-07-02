import { Express, Request, Response } from "express";

import {loginService, registerServer, logoutService, handleRefreshToken} from "../service/user.service";
import { loginValidate, signUpValidate } from '../support/validation/user.validation';

export const login = async (req: Request, res: Response) => {  
    const {email, password} = req.body;
    const {error} = loginValidate(req.body);
    if(error) {
        return res.status(404).json({message: error.details[0].message, code: 404})
    }

    const data = await loginService({email, password, res});
    if(data) {
        res.status(data.code).json({message: data.message, data: data?.data, code: data.code, tokens: data?.tokens})
    }
};


export const signup = async(req: Request, res: Response) => {
    try{
        const {email, password, username} = req.body;
        const {error} = signUpValidate(req.body);
        if(error) {
            return res.status(403).json({message: error.details[0].message, code: 403})
        }
        const data = await registerServer({email, password, username});
        if(data) {
            res.status(data.code).json({message: data.message, data: data?.data, code: data.code})
        }
    }catch(err) {
        res.status(500).json({message: 'Error from server', code: 500});
    }
}

export const logout = async (req: Request, res: Response) => {
    try{
        
        const tokenId = req.cookies.access_token;
        
        if(!tokenId) {
            return res.status(403).json({message: 'Unauthorized', code : 403})
        }
        const data = await logoutService(req, res);
        if(data) {
            res.status(data.code).json({message: data.message, code: data.code})
        }
    }catch(err) {
        res.status(500).json({message: 'Error from server', code: 500});
    }
}

export const refreshToken = async (req: Request, res: Response) => {
    try{
        const refreshTokenId = req.cookies.refresh_token;
        const accessTokenId = req.cookies.access_token;

        const data = await handleRefreshToken({res, accessTokenId, refreshTokenId});
        if(data) {
            res.status(data.code).json({message: data.message, data: data?.data, code: data.code});
        }

    }catch(err) {
        res.status(500).json({message: 'Error from server', code: 500})
    }
}
