const commentsRouter = require('express').Router();
const { patchComment } = require('../controllers/commentsControllers')
const { handle405s } = require('../errors')

commentsRouter.route('/:comment_id').patch(patchComment).all(handle405s)

module.exports = commentsRouter;