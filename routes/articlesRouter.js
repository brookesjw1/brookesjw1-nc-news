const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticle,
  postCommentToArticle,
  getCommentsByArticleId
} = require("../controllers/articlesControllers");
const { handle405s } = require("../errors");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticle)
  .all(handle405s);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  // .post(postCommentToArticle);

module.exports = articlesRouter;
