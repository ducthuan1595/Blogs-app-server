import {Schema, model} from 'mongoose';
import { type_notify } from '../utils/constant';
import { boolean } from 'joi';

// BLOG--001: create blog
// LIKE--002: user likes
// COMMENT--002: comment blog

const schema = new Schema({
    notify_type: {
        type: String,
        enum: [type_notify.BLOG_TYPE, type_notify.LIKE_TYPE, type_notify.CONTENT_TYPE, type_notify.REPLY_TYPE],
    },
    notify_senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    notify_receiverId: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true 
        }
    ],
    notify_content: {
        type: String,
        required: true
    },
    notify_option: {
        type: Object,
        default: {}
    },
    notify_unread: {
        type: Boolean,
        default: false
    }
}, {
    collection: 'notifications',
    timestamps: true
})


export default model('Notification', schema);