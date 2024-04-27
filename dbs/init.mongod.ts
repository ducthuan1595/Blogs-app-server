import mongoose from "mongoose";


// const connectMongodb = () => {
//     mongoose.createConnection(process.env.DATABASE_URL || '',
//         { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
//     ).then(() => {
//         console.log('Connected MongoDB');
        
//     }).catch((err: any) => console.error('Not connected MongoDB', err))

// }

// export default connectMongodb;