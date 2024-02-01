import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  image: {
    url: {
      type: String,
    },
    public_id: {
      type: String
    }
  }
}, {timestamps: true})

export default mongoose.model('Category', schema)