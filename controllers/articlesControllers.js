const { updateArticle, insertComment, fetchCommentsByArticleId, fetchArticles } = require('../models/articlesModels')

exports.getArticleById = (req,res,next) => {
    const { article_id } = req.params;
    // is there a way of not passing through req.query
    fetchArticles(article_id, req.query)
    .then(([article]) => {
        res.status(200).send({ article })
    })
    .catch(next)
}

exports.patchArticle = (req, res, next ) => {
    const { article_id } = req.params;
    updateArticle(article_id, req.body, req.query)
    .then(([article]) => {
        res.status(200).send({ article })
    })
    .catch(next)
}

exports.getCommentsByArticleId = (req,res,next) => {
    const { article_id } = req.params;
    fetchCommentsByArticleId(article_id, req.query).then((comments) => {
        res.status(200).send({ comments })
    })
    .catch(next)
}

exports.postCommentToArticle = (req, res, next) => {
    const { article_id } = req.params;
    const comment = req.body;
    insertComment(comment, article_id).then((comment) => {
        res.status(200).send({ comment })
    })
    .catch(next)
}

exports.getArticles = (req, res, next) => {
    fetchArticles(undefined, req.query).then((articles) => {
        res.status(200).send({ articles })
    })
    .catch(next)
}