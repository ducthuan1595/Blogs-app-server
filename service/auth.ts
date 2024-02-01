import User from '../model/auth';
import bcrypt from 'bcrypt';

export const loginService = async (email:string, password:string) => {
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
    return {
      status: 201,
      message: 'ok',
      data: user
    }
  }catch(err) {
    return {
      status: 500,
      message: 'Error from server'
    }
  }
}

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