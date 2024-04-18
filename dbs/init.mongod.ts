import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectMongodb = mongoose.createConnection(process.env.DATABASE_URL || '');

const initMongodb = () => {
    connectMongodb.on('connected', function() {
        console.log(`Mongodb connected`);
    })
    
    connectMongodb.on('disconnected', function() {
        console.log(`Mongodb disconnected`);
    })
    
    connectMongodb.on('error', function(err) {
        console.log(`Mongodb error:: ${err}`);
    })
    
    process.on('SIGINT', async() => {
        await connectMongodb.close();
        process.exit(0)
    })
}

export default initMongodb;