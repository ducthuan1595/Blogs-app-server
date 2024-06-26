import express, { Express, Request, Response } from "express";

import {loginService, registerServer} from "../service/user.service";
import { loginValidate, signUpValidate } from '../support/validation/user.validation';

export const login = async (req: Request, res: Response) => {  
    const {email, password} = req.body;
    const {error} = loginValidate(req.body);
    if(error) {
        return res.status(404).json({message: error.details[0].message, code: 404})
    }

    const data = await loginService({email, password, res});
    if(data) {
        res.status(data.code).json({message: data.message, data: data?.data})
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
            res.status(data.code).json({message: data.message, data: data?.data})
        }
    }catch(err) {

    }
}
