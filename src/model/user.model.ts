import mongoose, { Schema } from "mongoose";

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
  photo: {
    url: {
      type: String
    },
    public_id: String
  }
}, {timestamps: true})

export default mongoose.model('User', schema);