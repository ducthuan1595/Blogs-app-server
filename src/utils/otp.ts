import OtpGenerator from 'otp-generator';
import bcrypt from 'bcrypt';
import _Otp from '../model/otp.model';

const createOtp = () => {
    const otp = OtpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    });
    console.log('OTP:::', otp);
    return otp
}

const insertOtp = async(email: string, otp: string) => {
    try{
        const salt = await bcrypt.genSalt(10);
        const hashOtp = await bcrypt.hash(otp, salt);
        const newOtp = await _Otp.create({
            email,
            otp: hashOtp
        });
        return newOtp ? 1 : 0;
    }catch(err) {
        console.error(err);
    }
}

export {
    createOtp,
    insertOtp
}