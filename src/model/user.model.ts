import mongoose, { Schema } from "mongoose";
import { generateAvatar } from "../support/avatar";

const schema = new mongoose.Schema({
  username: {
    type: String,
    require: true
  },
  email: {
    type: String,
    unique: true,
    require: true
  },
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission'
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    url: {
      type: String
    },
    public_id: String,
    default: Buffer
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive'
  }
}, {timestamps: true})

export default mongoose.model('User', schema);