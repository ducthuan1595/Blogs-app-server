import {Schema, model} from 'mongoose';

const OtpSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now(),
        index: {
            expires: 300
        }
    }
}, {
    collection: 'otp'
})

// OtpSchema.index({ time: 1 }, { expireAfterSeconds: 60 });

export default model('Otp', OtpSchema);