import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      require: true,
    },
    desc: {
      type: String,
      require: true,
    },
    image: [
      {
        url: {
          type: String,
          require: true,
        },
        public_id: {
          type: String,
          require: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Post', schema);