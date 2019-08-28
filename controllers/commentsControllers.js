const { updateComment } = require('../models/commentsModels')

exports.patchComment = (req, res, next) => {
    const { comment_id } = req.params;
    updateComment(comment_id, req.body).then(([comment]) => {
        res.status(200).send({ comment })
    })
    .catch(next)
}