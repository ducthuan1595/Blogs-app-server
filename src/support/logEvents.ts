import fs from 'fs/promises';
import path from 'path';
import {format} from 'date-fns';

const dateTime = `${format(new Date(), 'dd-MM-yyyy')}`;
const fileName = path.join(__dirname, '../logs', 'logs_'+ dateTime +'.log');
const logEvents = (msg: any) => {
    const time = `${format(new Date(), 'dd-MM-yyyy\tss:mm:HH')}`;
    const contentLog = `${time}---------${msg}\n`
    try{
        fs.appendFile(fileName, contentLog)
    }catch(err) {
        console.error(err);
    }
}

export default logEvents;