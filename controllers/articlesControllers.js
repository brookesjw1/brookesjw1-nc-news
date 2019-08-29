const { updateArticle, insertComment, fetchCommentsByArticleId, fetchArticles } = require('../models/articlesModels')

exports.getArticleById = (req,res,next) => {
    const { article_id } = req.params;
    fetchArticles(article_id)
    .then(([article]) => {
        res.status(200).send({ article })
    })
    .catch(next)
}

exports.patchArticle = (req, res, next ) => {
    const { article_id } = req.params;
    if (Object.keys(req.body).length > 1) next({status: 400,
        msg: "Bad request"})

    updateArticle(article_id, req.body)
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
    const comment = {
        "author": req.body.username,
        "article_id": article_id,
        ...req.body,
    }
    delete comment.username;

    insertComment(comment, article_id).then((comments) => {
        res.status(201).send({ comments })
    })
    .catch(next)
}

exports.getArticles = (req, res, next) => {
    const { sort_by, order, author, topic } = req.query
    fetchArticles(undefined, sort_by, order, author, topic).then((articles) => {
        res.status(200).send({ articles })
    })
    .catch(next)
}