import _Comment from '../model/comment.model';

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

        const comment = new _Comment({
            blogId,
            userId,
            content,
            parentCommentId
        })

        let rightValue;

        if(parentCommentId) {
            const parenComment = await _Comment.findById(parentCommentId);
            if(!parenComment) {
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
                    code: 400
                }
            }
            const comments = await _Comment.find({
                blogId,
                left: { $gt: parent.left },
                right: { $lte: parent.right }
            }).select({
                right: 1,
                left: 1,
                content: 1,
                parentCommentId: 1
            }).sort({
                left: 1
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
        }).select({
            right: 1,
            left: 1,
            content: 1,
            parentCommentId: 1
        }).sort({
            left: 1
        })
        return {
            message: 'ok',
            code: 200,
            data: comments
        }
    }catch(err) {
        console.error(err); 
    }
 }

export {
    createCommentService,
    getCommentsByParentId
}