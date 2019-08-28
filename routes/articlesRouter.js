const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticle,
  postCommentToArticle,
  getCommentsByArticleId,
  getArticles
} = require("../controllers/articlesControllers");
const { handle405s } = require("../errors");

articlesRouter
  .route("/")
  .get(getArticles)
  .all(handle405s);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticle)
  .all(handle405s);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentToArticle)
  .all(handle405s);

module.exports = articlesRouter;
