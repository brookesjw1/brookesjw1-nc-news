const { updateComment, removeComment } = require('../models/commentsModels')

exports.patchComment = (req, res, next) => {
    const { comment_id } = req.params;
    if (Object.keys(req.body).length > 1) next({ 
        status: 400,
        msg: "Bad request"})
    updateComment(comment_id, req.body).then(([comment]) => {
        res.status(200).send({ comment })
    })
    .catch(next)
}

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    removeComment(comment_id).then(deleteCount => {
        res.status(204).send();
    })
    .catch(next)
}