import { Schema, model } from 'mongoose';

const DOCUMENT_NAME = 'Comment';

const schema = new Schema({
    blogId: {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    parentCommentId: {
        type: Schema.Types.ObjectId,
        ref: DOCUMENT_NAME,
        default: null
    },
    left: {
        type: Number,
        default: 0
    },
    right: {
        type: Number,
        default: 0
    },
    content: {
        type: String,
        default: 'text'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    collection: 'comments',
    timestamps: true
})

export default model(DOCUMENT_NAME, schema);