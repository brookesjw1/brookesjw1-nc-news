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
    const { inc_votes } = req.body;
    if (Object.keys(req.body).length > 1) next({ code: "XtraProp"})
    updateArticle(inc_votes, article_id)
    .then(article => {
        res.status(200).send({ article })
    })
    .catch(next)
}