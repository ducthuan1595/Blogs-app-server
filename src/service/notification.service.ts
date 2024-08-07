import _Notification from '../model/notification.model';
import { UserType } from '../types';
import { type_notify } from '../utils/constant';

const pushNotifyToSystem = async({
    type,
    receiverId,
    senderId,
    options
}: {
    type: string;
    receiverId: string;
    senderId: string;
    options: object;
}) => {
    try{
        let notifyContent;
        if(type === type_notify.BLOG_TYPE) {
            notifyContent = `just create a new blog`
        } else if (type === type_notify.LIKE_TYPE) {
            notifyContent = `just like your blog`
        } else if(type === type_notify.CONTENT_TYPE) {
            notifyContent = `just comment your blog`
        } else if(type === type_notify.REPLY_TYPE) {
            notifyContent = `just reply your comment`
        }
    
        const newNotify = await _Notification.create({
            notify_content: notifyContent,
            notify_receiverId: receiverId,
            notify_senderId: senderId,
            notify_option: options,
            notify_type: type,
        });
    
        return newNotify;
    }catch(err) {
        console.error(err);
        
    }
}

const pullNotifyFromClient = async(user: UserType, type: string) => {
    try{
        const match:any = {notify_receiverId: user._id};
        match['notify_unread'] = false;
        if(type !== 'ALL') {
            match['notify_type'] = type
        }
        
        const notifies = await _Notification.aggregate([
            {
                $match: match
            },
            {
                $lookup: {
                  from: 'users',
                  localField: 'notify_senderId',
                  foreignField: '_id',
                  as: 'sender'
                }
            },
            {
                $project: {
                    notify_type: 1,
                    notify_senderId: 1,
                    notify_receiverId: 1,
                    notify_content: 1,
                    createdAt: 1,
                    notify_option: 1,
                    sender: {
                        username: 1,
                        email: 1,
                        avatar: 1
                    }
                }
            }
        ]).sort({createdAt: -1})
        
        return notifies;
    }catch(err) {
        console.error(err);
    }
}

const getReadNotifyService = async (user: UserType, type: string) => {
    try{
        const match:any = {notify_receiverId: user._id};
        match['notify_unread'] = true;
        if(type !== 'ALL') {
            match['notify_type'] = type
        }
        
        const notifies = await _Notification.aggregate([
            {
                $match: match
            },
            {
                $lookup: {
                  from: 'users',
                  localField: 'notify_senderId',
                  foreignField: '_id',
                  as: 'sender'
                }
            },
            {
                $project: {
                    notify_type: 1,
                    notify_senderId: 1,
                    notify_receiverId: 1,
                    notify_content: 1,
                    createdAt: 1,
                    notify_option: 1,
                    sender: {
                        username: 1,
                        email: 1,
                        avatar: 1
                    }
                }
            }
        ]).sort({createdAt: -1})
        
        return notifies;
    }catch(err) {
        console.error(err);
    }
}

const convertNotifyRead = async (notifyId: string) => {
    try{
        const notify = await _Notification.findByIdAndUpdate(notifyId, {
            notify_unread: true
        }).sort({createdAt: -1});
        return {
            message: 'ok',
            code: 200
        }
    }catch(err) {
        console.error(err);
    }
}

export {
    pushNotifyToSystem,
    pullNotifyFromClient,
    getReadNotifyService,
    convertNotifyRead
}