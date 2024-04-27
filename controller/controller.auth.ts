import express, { Express, Request, Response } from "express";

import {loginService, registerServer, loginAdminService} from "../service/service.auth";

export const login = async (req: Request, res: Response) => {  
  const {email, password} = req.body;
  
  if(!email || !password) {
    return res.status(404).json({message: 'Not found'})
  }
  const data = await loginService(email, password.toString(), res);
  
  if(data) {
    res.status(data.status).json({message: data.message, data: data?.data})
  }
};

export const loginAdmin = async(req: Request, res:Response) => {
  
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(404).json({ message: "Not found" });
  }
  const data = await loginAdminService(email, password);
  if (data) {
    res.status(data.status).json({ message: data.message, data: data.data });
  }
}

export const signup = async(req: Request, res: Response) => {
  const {email, password, username} = req.body;
  if(!email || !password || !username) {
    return res.status(404).json({message: 'Not found'})
  }
  const data = await registerServer(email, password, username);
  if(data) {
    res.status(data.status).json({message: data.message})
  }
}
