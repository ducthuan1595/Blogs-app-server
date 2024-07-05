import _Comment from '../model/comment.model';
import _Blog from '../model/blog.model';
import { RequestCustom } from '../middleware/auth.middleware';
import { pushNotifyToSystem } from './notification.service';
import { type_notify } from '../utils/constant';

const createCommentService = async ({
    blogId,
    userId,
    content,
    parentCommentId
} : {
    blogId: string;
    userId: string;
    content: string;
    parentCommentId: string | null;
}) => {
    try{
        const blog = await _Blog.findById(blogId);
        if(!blog || !blog.userId) {
            return {
                message: 'Not found blog',
                code: 404
            }
        }
        const comment = new _Comment({
            blogId,
            userId,
            content,
            parentCommentId
        })

        let rightValue;

        if(parentCommentId) {
            const parenComment = await _Comment.findById(parentCommentId);
            if(!parenComment || !parenComment.userId) {
                return {
                    code: 404,
                    message: 'Parent comment not found'
                }
            }
            rightValue = parenComment.right;
            await _Comment.updateMany({
                blogId,
                right: { $gte: rightValue }
            }, {
                $inc: { right: 2 }
            });

            await _Comment.updateMany({
                blogId,
                left: { $gt: rightValue }
            }, {
                $inc: { left: 2 }
            })
            await pushNotifyToSystem({
                type: type_notify.REPLY_TYPE,
                receiverId: parenComment.userId.toString(),
                senderId: userId,
                options: {
                    blogId: blogId,
                    date: new Date().getTime(),
                    blogTitle: blog.title
                }
            })
        }else {
            const maxRightValue = await _Comment.findOne({
                blogId
            }, 'right', {sort: {right: -1}});
            if(maxRightValue) {
                rightValue = maxRightValue.right + 1
            }else {
                rightValue = 1
            }
        }

        comment.left = rightValue;
        comment.right = rightValue + 1;

        await comment.save();

        await pushNotifyToSystem({
            type: type_notify.CONTENT_TYPE,
            receiverId: blog.userId.toString(),
            senderId: userId,
            options: {
                blogId: blogId,
                date: new Date().getTime(),
                blogTitle: blog.title
            }
        })

        return {
            code: 201,
            message: 'ok',
            data: comment
        }
        
    }catch(err) {
        console.error(err);
    }
}

const getCommentsByParentId = async(
    blogId: string,
    parentCommentId: string | undefined,
    limit: number,
    offset: number
) => {
    try{
        if(parentCommentId) {
            const parent = await _Comment.findById(parentCommentId);
            if(!parent) {
                return {
                    message: 'Not found blog',
                    code: 200,
                    data: []
                }
            }
            const comments = await _Comment.find({
                blogId,
                left: { $gt: parent.left },
                right: { $lte: parent.right }
            }).populate('userId', '-password -roleId')
            .select({
                right: 1,
                left: 1,
                content: 1,
                parentCommentId: 1,
                createdAt: 1,
                _id: 1
            })
            .sort({
                updatedAt: -1
            })

            return {
                message: 'ok',
                code: 200,
                data: comments
            }
        }
        const comments = await _Comment.find({
            blogId,
            parentCommentId
        }).populate('userId', '-password -roleId')
        .select({
            right: 1,
            left: 1,
            content: 1,
            parentCommentId: 1,
            createdAt: 1,
            _id: 1
        })
        .sort({
            updatedAt: -1
        })
        .skip(limit * (offset - 1))
        .limit(limit)
        return {
            message: 'ok',
            code: 200,
            data: comments
        }
    }catch(err) {
        console.error(err); 
    }
}

const getLengthCommentByBlog = async (blogId: string) => {
    try{
        const length = await _Comment.countDocuments({blogId});
        return {
            message: 'ok',
            code: 201,
            data: length
        }
    }catch(err) {
        console.error(err);
    }
}

const deleteCommentService = async (blogId: string, commentId: string, req: RequestCustom) => {
    try{
        // check user
        const blog = await _Blog.findById(blogId);
        if(!blog) {
            return {
                message: 'Not found blog',
                code: 400
            }
        }
        
        if(!req.user?.roleId['user']) {
            return {
                message: 'Unauthorized',
                code: 403
            }
        }
        const comment = await _Comment.findById(commentId);
        if(!comment) {
            return {
                message: 'Not found blog',
                code: 400
            }
        }
        const leftValue = comment.left;
        const rightValue = comment.right;
        const width = rightValue - leftValue + 1;
        await _Comment.deleteMany({
            blogId,
            left: {
                $gte: leftValue,
                $lte: rightValue
            }
        })
        await _Comment.updateMany({
            blogId,
            right: { $gt: rightValue }
        }, {
            $inc: { right: -width }
        })
        await _Comment.updateMany({
            blogId,
            right: { $gt: leftValue }
        }, {
            $inc: { left: -width }
        })

        return {
            message: 'ok',
            code: 200
        }
    }catch(err) {
        console.error(err);
        
    }
}

export {
    createCommentService,
    getCommentsByParentId,
    deleteCommentService,
    getLengthCommentByBlog
}