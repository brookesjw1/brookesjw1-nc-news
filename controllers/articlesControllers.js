const { fetchArticleById, updateArticle, insertComment, fetchCommentsByArticleId } = require('../models/articlesModels')

exports.getArticleById = (req,res,next) => {
    const { article_id } = req.params;
    fetchArticleById(article_id)
    .then(([article]) => {
        res.status(200).send({ article })
    })
    .catch(next)
}

exports.patchArticle = (req, res, next ) => {
    const { article_id } = req.params;
    updateArticle(req.body, article_id)
    .then(([article]) => {
        res.status(200).send({ article })
    })
    .catch(next)
}

exports.getCommentsByArticleId = (req,res,next) => {
    // const { sort_by } = req.query;
    const { article_id } = req.params;
    fetchCommentsByArticleId(article_id, req.query).then((comments) => {
        res.status(200).send({ comments })
    })
    .catch(next)
}














// exports.postCommentToArticle = (req, res, next) => {
//     const { article_id } = req.params;
//     const comment = req.body;
//     insertComment(comment, article_id).then((comment) => {
//         res.status(200).send({ comment })
//     })
//     .catch(next)
// }

