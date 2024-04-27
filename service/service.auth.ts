import bcrypt from 'bcrypt';
import { Response } from 'express';

import {createToken, createRefreshToken} from '../support/createToken';
import User from '../model/model.auth';

export const loginService = async (email:string, password:string, res: Response) => {
  try{
    
    const user = await User.findOne({email: email});
     
    if(!user) {
      return {
        status: 401,
        message: 'User is not exist'
      }
    }
    
    const validPw = await bcrypt.compare(password, user.password);
    if(!validPw) {
      return {
        status: 401,
        message: 'Password is incorrect'
      }
    }
    user.password = '';

    const data = {
      username: user.username,
      email: user.email
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
    })
  
    return {
      status: 201,
      message: "ok",
      data: data,
    };
  }catch(err) {
    console.log('Error:::', err);
    return {
      status: 500,
      message: 'Error from server'
    }
  }
}

export const loginAdminService = async (email: string, password: string) => {
  try {
    const user = await User.findOne({ email: email });
    if (!user || user.role !== 'F2') {
      return {
        status: 403,
        message: "Unauthorized",
      };
    }

    const validPw = await bcrypt.compare(password, user.password);
    if (!validPw) {
      return {
        status: 401,
        message: "Password is incorrect",
      };
    }
    user.password = "";

    const data = {
      user,
      token: createToken(user._id.toString()),
    }
  
    return {
      status: 201,
      message: "ok",
      data: data,
    };
  } catch (err) {
    return {
      status: 500,
      message: "Error from server",
    };
  }
};

export const registerServer = async (email: string, password: string, username: string) => {
  try{
    const user = await User.findOne({email: email});
    if(user) {
      return {
        status: 403,
        message: 'Email was exist'
      }
    }
    const pw = await bcrypt.hash(password, 12);
    const newUser = new User({
      username,
      email,
      password: pw
    })
    await newUser.save();
    return {
      status: 200,
      message: 'ok',
    }
  }catch(err) {
    return {
      status: 500,
      message: 'Error from server'
    }
  }
}