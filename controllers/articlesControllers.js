const { fetchArticleById, updateArticle } = require('../models/articlesModels')

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