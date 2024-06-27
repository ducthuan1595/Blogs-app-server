import { Schema, model } from "mongoose";

const schema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        maxlength: 1024,
        trim: true,
    },
    version: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    permissions: {
        type: String,
        default: ['GENERAL']
    },
    status: {
        type: Boolean,
        default: false
    }
}, {
    collection: 'apikeys',
    timestamps: true
})

export default model('Apikey', schema);