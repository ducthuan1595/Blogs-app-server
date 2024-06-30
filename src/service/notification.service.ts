import _Notification from '../model/notification.model';
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
    let notifyContent;
    if(type === type_notify.BLOG_TYPE) {
        notifyContent = `@@@ just create a new blog @@@`
    } else if (type === type_notify.LIKE_TYPE) {
        notifyContent = `@@@ just like your blog @@@`
    } else if(type === type_notify.CONTENT_TYPE) {
        notifyContent = `@@@ just comment your blog @@@`
    }

    const newNotify = await _Notification.create({
        notify_content: notifyContent,
        notify_receiverId: receiverId,
        notify_senderId: senderId,
        notify_option: options,
        notify_type: type
    });

    return newNotify;
}

export {
    pushNotifyToSystem
}