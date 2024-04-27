import mongoose from "mongoose";

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
  role: {
    type: String,
    default: 'F0'
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