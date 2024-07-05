import mongoose from "mongoose";
require('dotenv').config();

mongoose.connect('mongodb://localhost:27017/blog_app').then((_) => {
    console.log('Connected mongoose success!!!');
}).catch(err => console.error('Error connect::', err))

mongoose.set('debug', true);

mongoose.set('debug', {color: false});

mongoose.set('debug', {shell: true});

export default mongoose;