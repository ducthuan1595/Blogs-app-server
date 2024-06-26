import {Schema, model} from 'mongoose';

const schema = new Schema(
    {
        user: Boolean,
        moderator: Boolean,
        admin: Boolean,
        guest: Boolean,
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            unique: true
        }
    }
);

export default model('Permission', schema);